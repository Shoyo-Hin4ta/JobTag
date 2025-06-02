'use client'

import { useState, useEffect, useRef, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

interface AddApplicationModalProps {
  isOpen: boolean
  onClose: () => void
}

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied', icon: '🟡' },
  { value: 'screening', label: 'Screening', icon: '🟠' },
  { value: 'interview', label: 'Interview', icon: '🔵' },
  { value: 'technical', label: 'Technical', icon: '🟣' },
  { value: 'final', label: 'Final Round', icon: '🔷' },
  { value: 'offer', label: 'Offer', icon: '🟢' },
  { value: 'rejected', label: 'Rejected', icon: '🔴' },
  { value: 'withdrawn', label: 'Withdrawn', icon: '⚫' },
]

export default function AddApplicationModal({ isOpen, onClose }: AddApplicationModalProps) {
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
    location: '',
    job_url: '',
    notes: '',
    applied_date: new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.position.trim()) newErrors.position = 'Position is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        company: formData.company.trim(),
        position: formData.position.trim(),
        status: formData.status,
        location: formData.location.trim() || null,
        job_url: formData.job_url.trim() || null,
        notes: formData.notes.trim() || null,
        created_at: new Date(formData.applied_date).toISOString(),
        status_history: [{
          status: 'applied',
          date: new Date(formData.applied_date).toISOString(),
          note: 'Application submitted'
        }]
      })

      if (error) throw error

      // Show success animation
      setShowSuccess(true)
      setTimeout(() => {
        onClose()
        router.refresh()
        // Reset form
        setFormData({
          company: '',
          position: '',
          status: 'applied',
          location: '',
          job_url: '',
          notes: '',
          applied_date: new Date().toISOString().split('T')[0]
        })
        setShowSuccess(false)
      }, 1500)
    } catch (error) {
      console.error('Error adding application:', error)
      setErrors({ submit: 'Failed to add application. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel ref={modalRef} className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/20 p-4 md:p-6 shadow-xl transition-all mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-white">
                    Add New Application
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {showSuccess ? (
                  <div className="py-12 text-center">
                    <div className="text-6xl mb-4 animate-bounce">✅</div>
                    <p className="text-lg text-white">Application added successfully!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Company Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`
                          w-full px-4 py-2 rounded-lg
                          bg-white/5 border ${errors.company ? 'border-red-500' : 'border-white/10'}
                          text-white placeholder-gray-500
                          focus:outline-none focus:border-purple-500 focus:bg-white/10
                          transition-all duration-200
                        `}
                        placeholder="e.g., Google"
                      />
                      {errors.company && (
                        <p className="mt-1 text-xs text-red-400">{errors.company}</p>
                      )}
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Position Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className={`
                          w-full px-4 py-2 rounded-lg
                          bg-white/5 border ${errors.position ? 'border-red-500' : 'border-white/10'}
                          text-white placeholder-gray-500
                          focus:outline-none focus:border-purple-500 focus:bg-white/10
                          transition-all duration-200
                        `}
                        placeholder="e.g., Software Engineer"
                      />
                      {errors.position && (
                        <p className="mt-1 text-xs text-red-400">{errors.position}</p>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-200"
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value} className="bg-gray-900">
                            {option.icon} {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Applied Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Applied Date
                      </label>
                      <input
                        type="date"
                        name="applied_date"
                        value={formData.applied_date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-200"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-200"
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>

                    {/* Job URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Job URL
                      </label>
                      <input
                        type="url"
                        name="job_url"
                        value={formData.job_url}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-200"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-200 resize-none"
                        placeholder="Any additional notes..."
                      />
                    </div>

                    {errors.submit && (
                      <p className="text-sm text-red-400">{errors.submit}</p>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Adding...' : 'Add Application'}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
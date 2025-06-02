'use client'

import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import AddApplicationModal from './add-application-modal'

export default function AddApplicationFAB() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true)
    window.addEventListener('openAddApplication', handleOpenModal)
    return () => window.removeEventListener('openAddApplication', handleOpenModal)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          fixed bottom-24 right-6 md:bottom-6 md:right-6
          w-14 h-14 rounded-full
          bg-gradient-to-r from-purple-500 to-blue-500
          text-white shadow-lg shadow-purple-500/30
          flex items-center justify-center
          transform transition-all duration-200
          hover:scale-110 active:scale-95
          hover:shadow-xl hover:shadow-purple-500/40
          z-40
        "
      >
        <Plus className="w-6 h-6" />
      </button>

      <AddApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
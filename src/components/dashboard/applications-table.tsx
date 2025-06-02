'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ApplicationRow from './application-row'
import ApplicationsTableMobile from './applications-table-mobile'
import gsap from 'gsap'
import { Database } from '@/lib/supabase/types'

type Application = Database['public']['Tables']['applications']['Row']

interface ApplicationsTableProps {
  applications: Application[]
}

type SortField = 'company' | 'position' | 'status' | 'updated_at' | 'created_at'
type SortDirection = 'asc' | 'desc'

export default function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const [sortField, setSortField] = useState<SortField>('updated_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      )
    }
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedApplications = [...applications].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const toggleExpanded = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
        <div className="animate-float mb-6 text-6xl">👨‍🚀</div>
        <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
        <p className="text-gray-400 mb-6">Start tracking your job applications to see them here</p>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('openAddApplication'))}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
        >
          Add Your First Application
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        <ApplicationsTableMobile applications={sortedApplications} />
      </div>

      {/* Desktop View */}
      <div ref={tableRef} className="hidden md:block bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th 
                onClick={() => handleSort('company')}
                className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Company</span>
                  {sortField === 'company' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('position')}
                className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Position</span>
                  {sortField === 'position' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('updated_at')}
                className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Last Update</span>
                  {sortField === 'updated_at' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                Days Active
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedApplications.map((application) => (
              <ApplicationRow
                key={application.id}
                application={application}
                isExpanded={expandedRows.has(application.id)}
                onToggle={() => toggleExpanded(application.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}
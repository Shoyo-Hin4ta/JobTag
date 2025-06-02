'use client'

import { useRef, useEffect, Fragment } from 'react'
import { formatDistanceToNow } from 'date-fns'
import gsap from 'gsap'
import { Database } from '@/lib/supabase/types'
import ApplicationTimeline from './application-timeline'

type Application = Database['public']['Tables']['applications']['Row']

interface ApplicationRowProps {
  application: Application
  isExpanded: boolean
  onToggle: () => void
}

const STATUS_CONFIG = {
  applied: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-200',
    icon: '🟡',
    label: 'Applied'
  },
  screening: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    text: 'text-orange-200',
    icon: '🟠',
    label: 'Screening'
  },
  interview: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    text: 'text-blue-200',
    icon: '🔵',
    label: 'Interview'
  },
  technical: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/50',
    text: 'text-purple-200',
    icon: '🟣',
    label: 'Technical'
  },
  final: {
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/50',
    text: 'text-indigo-200',
    icon: '🔷',
    label: 'Final Round'
  },
  offer: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    text: 'text-green-200',
    icon: '🟢',
    label: 'Offer'
  },
  rejected: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-200',
    icon: '🔴',
    label: 'Rejected'
  },
  withdrawn: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/50',
    text: 'text-gray-400',
    icon: '⚫',
    label: 'Withdrawn'
  }
}

export default function ApplicationRow({ application, isExpanded, onToggle }: ApplicationRowProps) {
  const rowRef = useRef<HTMLTableRowElement>(null)
  const expandedRef = useRef<HTMLTableRowElement>(null)
  const statusConfig = STATUS_CONFIG[application.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.applied

  useEffect(() => {
    if (expandedRef.current) {
      if (isExpanded) {
        gsap.fromTo(
          expandedRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
      } else {
        gsap.to(expandedRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        })
      }
    }
  }, [isExpanded])

  const daysActive = Math.floor(
    (new Date().getTime() - new Date(application.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Fragment>
      <tr
        ref={rowRef}
        onClick={onToggle}
        data-application-id={application.id}
        className="cursor-pointer hover:bg-white/5 transition-colors duration-200 group"
      >
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏢</span>
            <span className="text-white font-medium group-hover:text-purple-300 transition-colors">
              {application.company}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-gray-300">
          {application.position}
        </td>
        <td className="px-6 py-4">
          <span className={`
            inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium
            ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border
          `}>
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </span>
        </td>
        <td className="px-6 py-4 text-gray-400 text-sm">
          {formatDistanceToNow(new Date(application.updated_at), { addSuffix: true })}
        </td>
        <td className="px-6 py-4 text-gray-400 text-sm">
          {daysActive} days
        </td>
      </tr>
      
      {isExpanded && (
        <tr ref={expandedRef} className="bg-black/20">
          <td colSpan={5} className="p-0 overflow-hidden">
            <div className="px-6 py-4">
              <ApplicationTimeline 
                statusHistory={application.status_history as any || []} 
                currentStatus={application.status}
                createdAt={application.created_at}
              />
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  )
}
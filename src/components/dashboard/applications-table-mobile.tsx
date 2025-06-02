'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { MoreVertical, ExternalLink } from 'lucide-react'
import { Database } from '@/lib/supabase/types'
import ApplicationTimeline from './application-timeline'

type Application = Database['public']['Tables']['applications']['Row']

interface ApplicationsTableMobileProps {
  applications: Application[]
}

const STATUS_CONFIG = {
  applied: { bg: 'bg-yellow-500/20', text: 'text-yellow-200', icon: '🟡' },
  screening: { bg: 'bg-orange-500/20', text: 'text-orange-200', icon: '🟠' },
  interview: { bg: 'bg-blue-500/20', text: 'text-blue-200', icon: '🔵' },
  technical: { bg: 'bg-purple-500/20', text: 'text-purple-200', icon: '🟣' },
  final: { bg: 'bg-indigo-500/20', text: 'text-indigo-200', icon: '🔷' },
  offer: { bg: 'bg-green-500/20', text: 'text-green-200', icon: '🟢' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-200', icon: '🔴' },
  withdrawn: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚫' }
}

export default function ApplicationsTableMobile({ applications }: ApplicationsTableMobileProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  if (applications.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
        <div className="animate-float mb-4 text-5xl">👨‍🚀</div>
        <h3 className="text-lg font-semibold text-white mb-2">No applications yet</h3>
        <p className="text-gray-400 text-sm">Start tracking your job applications</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {applications.map((application) => {
        const statusConfig = STATUS_CONFIG[application.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.applied
        const isExpanded = expandedCard === application.id
        const daysActive = application.created_at
          ? Math.floor(
              (new Date().getTime() - new Date(application.created_at).getTime()) / (1000 * 60 * 60 * 24)
            )
          : 0

        return (
          <div
            key={application.id}
            data-application-id={application.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
          >
            {/* Card Header */}
            <div 
              onClick={() => setExpandedCard(isExpanded ? null : application.id)}
              className="p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xl">🏢</span>
                    <h3 className="font-semibold text-white">{application.company_name}</h3>
                  </div>
                  <p className="text-sm text-gray-300">{application.position_title}</p>
                </div>
                <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`
                    inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs
                    ${statusConfig.bg} ${statusConfig.text}
                  `}>
                    <span>{statusConfig.icon}</span>
                    <span>{application.status}</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    {application.updated_at 
                      ? formatDistanceToNow(new Date(application.updated_at), { addSuffix: true })
                      : 'Never'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{daysActive}d</span>
              </div>
            </div>

            {/* Expanded Timeline */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-white/10 pt-4">
                <ApplicationTimeline 
                  statusHistory={application.status_history as any || []} 
                  currentStatus={application.status || 'applied'}
                  createdAt={application.created_at || new Date().toISOString()}
                />
                
                {application.job_url && (
                  <a 
                    href={application.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 mt-4 text-xs text-purple-400 hover:text-purple-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Job Posting</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
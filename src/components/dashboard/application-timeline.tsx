'use client'

import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import gsap from 'gsap'

interface StatusEvent {
  status: string
  date: string
  email_id?: string
  confidence?: number
  note?: string
}

interface ApplicationTimelineProps {
  statusHistory: StatusEvent[]
  currentStatus: string
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  technical: 'Technical Round',
  final: 'Final Round',
  offer: 'Offer Received',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn'
}

export default function ApplicationTimeline({ statusHistory, currentStatus, createdAt }: ApplicationTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  
  // Create a complete timeline including the initial application
  const timeline = [
    {
      status: currentStatus,
      date: new Date().toISOString(),
      note: 'Current status'
    },
    ...statusHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    {
      status: 'applied',
      date: createdAt,
      note: 'Application submitted'
    }
  ]

  useEffect(() => {
    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll('.timeline-item')
      gsap.fromTo(
        items,
        { x: -20, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.3, 
          stagger: 0.1,
          ease: 'power2.out' 
        }
      )
    }
  }, [])

  return (
    <div ref={timelineRef} className="relative">
      <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-white/10"></div>
      
      {timeline.map((event, index) => {
        const isFirst = index === 0
        const isLast = index === timeline.length - 1
        
        return (
          <div key={`${event.status}-${index}`} className="timeline-item relative flex items-start mb-6 last:mb-0">
            {/* Dot */}
            <div className={`
              relative z-10 w-8 h-8 rounded-full flex items-center justify-center
              ${isFirst ? 'bg-purple-500/30 border-2 border-purple-500' : 'bg-white/10 border border-white/20'}
            `}>
              <div className={`
                w-3 h-3 rounded-full
                ${isFirst ? 'bg-purple-400 animate-pulse' : 'bg-white/50'}
              `}></div>
            </div>
            
            {/* Content */}
            <div className="ml-4 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <h4 className={`
                  text-sm font-medium
                  ${isFirst ? 'text-purple-300' : 'text-white'}
                `}>
                  {STATUS_LABELS[event.status] || event.status}
                </h4>
                <span className="text-xs text-gray-500 mt-1 sm:mt-0">
                  {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              
              {event.note && (
                <p className="text-xs text-gray-400 mt-1">{event.note}</p>
              )}
              
              {event.confidence && (
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-500">AI Confidence:</span>
                  <div className="flex-1 max-w-[100px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${event.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{Math.round(event.confidence * 100)}%</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
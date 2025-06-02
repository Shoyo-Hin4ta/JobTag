'use client'

import { useEffect, useState } from 'react'
import { useApplications } from '@/hooks/use-applications'
import ApplicationsTable from './applications-table'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { toast } from 'sonner'
import gsap from 'gsap'

type Application = Database['public']['Tables']['applications']['Row']

interface RealtimeApplicationsWrapperProps {
  initialApplications: Application[]
  statusFilter?: string
}

export default function RealtimeApplicationsWrapper({ 
  initialApplications, 
  statusFilter 
}: RealtimeApplicationsWrapperProps) {
  const [applications, setApplications] = useState(initialApplications)
  const supabase = createClient()

  useEffect(() => {
    // Get current user
    const getUserAndSubscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Set up realtime subscription
      const channel = supabase
        .channel('dashboard-applications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'applications',
            filter: `user_id=eq.${user.id}`
          },
          async (payload) => {
            if (payload.eventType === 'INSERT') {
              const newApp = payload.new as Application
              setApplications(prev => {
                // Check if it already exists to prevent duplicates
                if (prev.find(app => app.id === newApp.id)) return prev
                
                // Show toast notification
                toast.success(`New application added: ${newApp.company}`, {
                  description: newApp.position,
                  duration: 5000,
                })

                // Animate new row after a short delay
                setTimeout(() => {
                  const newRow = document.querySelector(`[data-application-id="${newApp.id}"]`)
                  if (newRow) {
                    gsap.fromTo(newRow, 
                      { 
                        opacity: 0, 
                        y: -20, 
                        scale: 0.95,
                        backgroundColor: 'rgba(147, 51, 234, 0.2)' // purple glow
                      },
                      { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        backgroundColor: 'transparent',
                        duration: 0.6,
                        ease: "back.out(1.7)"
                      }
                    )
                  }
                }, 100)

                return [newApp, ...prev]
              })
            } else if (payload.eventType === 'UPDATE') {
              const updatedApp = payload.new as Application
              setApplications(prev => 
                prev.map(app => app.id === updatedApp.id ? updatedApp : app)
              )
              
              // Show toast for status changes
              const oldApp = applications.find(app => app.id === updatedApp.id)
              if (oldApp && oldApp.status !== updatedApp.status) {
                toast.info(`Status updated for ${updatedApp.company}`, {
                  description: `Changed to: ${updatedApp.status}`,
                  duration: 4000,
                })
              }
            } else if (payload.eventType === 'DELETE') {
              setApplications(prev => prev.filter(app => app.id !== payload.old.id))
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    getUserAndSubscribe()
  }, [supabase])

  // Filter applications based on status
  const filteredApplications = statusFilter && statusFilter !== 'all'
    ? applications.filter(app => {
        if (statusFilter === 'interview') {
          return ['screening', 'interview', 'technical', 'final'].includes(app.status)
        }
        return app.status === statusFilter
      })
    : applications

  return <ApplicationsTable applications={filteredApplications} />
}
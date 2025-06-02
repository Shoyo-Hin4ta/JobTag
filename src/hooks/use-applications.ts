'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { applicationService, ApplicationFilters } from '@/lib/services/application-service'
import type { Database } from '@/lib/supabase/types'

type Application = Database['public']['Tables']['applications']['Row']

interface UseApplicationsOptions {
  filters?: ApplicationFilters
  realtime?: boolean
}

export function useApplications(options: UseApplicationsOptions = {}) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await applicationService.getApplications(options.filters)
      setApplications(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()

    // Set up realtime subscription if enabled
    if (options.realtime) {
      const channel = supabase
        .channel('applications-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'applications'
          },
          (payload) => {
            // Handle changes
            if (payload.eventType === 'INSERT') {
              setApplications(prev => [payload.new as Application, ...prev])
            } else if (payload.eventType === 'UPDATE') {
              setApplications(prev => 
                prev.map(app => app.id === payload.new.id ? payload.new as Application : app)
              )
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
  }, [JSON.stringify(options.filters), options.realtime])

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications
  }
}

// Hook for a single application
export function useApplication(id: string) {
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true)
        const data = await applicationService.getApplication(id)
        setApplication(data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()

    // Set up realtime subscription for this specific application
    const channel = supabase
      .channel(`application-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'applications',
          filter: `id=eq.${id}`
        },
        (payload) => {
          setApplication(payload.new as Application)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, supabase])

  return {
    application,
    loading,
    error
  }
}
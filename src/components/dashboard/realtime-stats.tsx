'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Application = Database['public']['Tables']['applications']['Row']

export default function RealtimeStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    thisWeek: 0
  })

  const supabase = createClient()

  const calculateStats = (applications: Application[]) => {
    const total = applications.length
    const active = applications.filter(app => 
      ['applied', 'screening', 'interview', 'technical', 'final'].includes(app.status)
    ).length

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const thisWeek = applications.filter(app => 
      new Date(app.created_at) > oneWeekAgo
    ).length

    return { total, active, thisWeek }
  }

  useEffect(() => {
    // Initial fetch
    const fetchStats = async () => {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)

      if (data) {
        setStats(calculateStats(data))
      }
    }

    fetchStats()

    // Subscribe to changes
    const channel = supabase
      .channel('stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${userId}`
        },
        async () => {
          // Refetch all applications to recalculate stats
          const { data } = await supabase
            .from('applications')
            .select('*')
            .eq('user_id', userId)

          if (data) {
            setStats(calculateStats(data))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">Total Applications</span>
        <span className="text-sm font-semibold text-white animate-fade-in">{stats.total}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">Active</span>
        <span className="text-sm font-semibold text-green-400 animate-fade-in">{stats.active}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">This Week</span>
        <span className="text-sm font-semibold text-purple-400 animate-fade-in">{stats.thisWeek}</span>
      </div>
    </div>
  )
}
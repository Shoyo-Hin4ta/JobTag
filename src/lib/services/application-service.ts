import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type Application = Database['public']['Tables']['applications']['Row']
type ApplicationInsert = Database['public']['Tables']['applications']['Insert']
type ApplicationUpdate = Database['public']['Tables']['applications']['Update']

export type ApplicationStatus = 
  | 'applied'
  | 'screening'
  | 'interview'
  | 'technical'
  | 'final'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export type ApplicationSource = 'email' | 'manual'

export interface ApplicationFilters {
  status?: ApplicationStatus[]
  archived?: boolean
  search?: string
  dateFrom?: Date
  dateTo?: Date
}

export class ApplicationService {
  /**
   * Create a new application (server-side)
   */
  async createApplication(data: Omit<ApplicationInsert, 'user_id'>): Promise<Application | null> {
    'use server'
    
    const supabase = await createServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        ...data,
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating application:', error)
      return null
    }

    return application
  }

  /**
   * Update an application (server-side)
   */
  async updateApplication(id: string, updates: ApplicationUpdate): Promise<Application | null> {
    'use server'
    
    const supabase = await createServerClient()
    
    const { data: application, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating application:', error)
      return null
    }

    return application
  }

  /**
   * Get applications with filters (client-side)
   */
  async getApplications(filters?: ApplicationFilters) {
    const supabase = createClient()
    
    let query = supabase
      .from('applications')
      .select('*')
      .order('updated_at', { ascending: false })

    // Apply filters
    if (filters?.archived !== undefined) {
      query = query.eq('archived', filters.archived)
    }

    if (filters?.status && filters.status.length > 0) {
      query = query.in('status', filters.status)
    }

    if (filters?.search) {
      query = query.or(`company_name.ilike.%${filters.search}%,position_title.ilike.%${filters.search}%`)
    }

    if (filters?.dateFrom) {
      query = query.gte('applied_date', filters.dateFrom.toISOString())
    }

    if (filters?.dateTo) {
      query = query.lte('applied_date', filters.dateTo.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching applications:', error)
      return []
    }

    return data || []
  }

  /**
   * Get a single application by ID (client-side)
   */
  async getApplication(id: string): Promise<Application | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching application:', error)
      return null
    }

    return data
  }

  /**
   * Archive/unarchive an application (server-side)
   */
  async toggleArchive(id: string, archived: boolean): Promise<boolean> {
    'use server'
    
    const supabase = await createServerClient()
    
    const { error } = await supabase
      .from('applications')
      .update({ archived })
      .eq('id', id)

    if (error) {
      console.error('Error toggling archive:', error)
      return false
    }

    return true
  }

  /**
   * Delete an application (server-side)
   */
  async deleteApplication(id: string): Promise<boolean> {
    'use server'
    
    const supabase = await createServerClient()
    
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting application:', error)
      return false
    }

    return true
  }

  /**
   * Get application statistics (client-side)
   */
  async getStatistics() {
    const supabase = createClient()
    
    const { data: applications, error } = await supabase
      .from('applications')
      .select('status, created_at')
      .eq('archived', false)

    if (error || !applications) {
      console.error('Error fetching statistics:', error)
      return null
    }

    // Calculate statistics
    const stats = {
      total: applications.length,
      byStatus: applications.reduce((acc, app) => {
        acc[app.status || 'applied'] = (acc[app.status || 'applied'] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      last30Days: applications.filter(app => {
        const createdAt = new Date(app.created_at!)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return createdAt >= thirtyDaysAgo
      }).length,
      responseRate: this.calculateResponseRate(applications)
    }

    return stats
  }

  /**
   * Calculate response rate (percentage of applications that got past 'applied' status)
   */
  private calculateResponseRate(applications: Array<{ status: string | null }>) {
    if (applications.length === 0) return 0
    
    const responded = applications.filter(app => 
      app.status && app.status !== 'applied'
    ).length
    
    return Math.round((responded / applications.length) * 100)
  }
}

// Export singleton instance
export const applicationService = new ApplicationService()
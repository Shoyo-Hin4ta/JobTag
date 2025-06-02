import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type OAuthConnection = Database['public']['Tables']['oauth_connections']['Row']
type OAuthConnectionInsert = Database['public']['Tables']['oauth_connections']['Insert']
type OAuthConnectionUpdate = Database['public']['Tables']['oauth_connections']['Update']

export type Provider = 'google' | 'outlook'
export type SyncStatus = 'idle' | 'syncing' | 'error'

export class OAuthConnectionService {
  /**
   * Get user's OAuth connections (client-side)
   */
  async getConnections(): Promise<OAuthConnection[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('oauth_connections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching OAuth connections:', error)
      return []
    }

    return data || []
  }

  /**
   * Get a specific OAuth connection (client-side)
   */
  async getConnection(provider: Provider): Promise<OAuthConnection | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('oauth_connections')
      .select('*')
      .eq('provider', provider)
      .single()

    if (error && error.code !== 'PGRST116') { // Not found is ok
      console.error('Error fetching OAuth connection:', error)
    }

    return data || null
  }

  /**
   * Create or update OAuth connection after email permission granted (server-side)
   */
  async upsertConnection(connectionData: {
    provider: Provider
    email_address: string
    access_token: string
    refresh_token: string
    token_expires_at: string
  }): Promise<OAuthConnection | null> {
    'use server'
    
    const supabase = await createServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('oauth_connections')
      .upsert({
        user_id: user.id,
        ...connectionData,
        sync_status: 'idle',
        error_message: null
      }, {
        onConflict: 'user_id,provider'
      })
      .select()
      .single()

    if (error) {
      console.error('Error upserting OAuth connection:', error)
      return null
    }

    return data
  }

  /**
   * Update sync status (server-side)
   */
  async updateSyncStatus(
    connectionId: string, 
    status: SyncStatus, 
    errorMessage?: string
  ): Promise<boolean> {
    'use server'
    
    const supabase = await createServerClient()
    
    const updates: OAuthConnectionUpdate = {
      sync_status: status,
      error_message: errorMessage || null
    }

    if (status === 'idle') {
      updates.last_sync_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('oauth_connections')
      .update(updates)
      .eq('id', connectionId)

    if (error) {
      console.error('Error updating sync status:', error)
      return false
    }

    return true
  }

  /**
   * Disconnect email provider (server-side)
   */
  async disconnect(provider: Provider): Promise<boolean> {
    'use server'
    
    const supabase = await createServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Delete the connection
    const { error } = await supabase
      .from('oauth_connections')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider)

    if (error) {
      console.error('Error disconnecting provider:', error)
      return false
    }

    // TODO: In Week 2, also clean up any related emails and labels

    return true
  }

  /**
   * Check if user has any email connections
   */
  async hasEmailConnections(): Promise<boolean> {
    const connections = await this.getConnections()
    return connections.length > 0
  }

  /**
   * Get connection status summary
   */
  async getConnectionStatus() {
    const connections = await this.getConnections()
    
    const status = {
      google: connections.find(c => c.provider === 'google') || null,
      outlook: connections.find(c => c.provider === 'outlook') || null,
      hasAnyConnection: connections.length > 0,
      totalConnections: connections.length,
      hasErrors: connections.some(c => c.sync_status === 'error')
    }

    return status
  }

  /**
   * Check if token needs refresh (client-side helper)
   */
  isTokenExpired(connection: OAuthConnection): boolean {
    if (!connection.token_expires_at) return false
    
    const expiresAt = new Date(connection.token_expires_at)
    const now = new Date()
    
    // Consider token expired if it expires in the next 5 minutes
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)
    
    return expiresAt <= fiveMinutesFromNow
  }
}

// Export singleton instance
export const oauthConnectionService = new OAuthConnectionService()
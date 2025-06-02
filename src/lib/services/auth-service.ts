import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// JSON schema validation for profile settings
const DEFAULT_SETTINGS = {
  theme: 'auto' as 'light' | 'dark' | 'auto',
  autoLabeling: true,
  syncFrequency: 'realtime' as 'realtime' | 'hourly' | 'daily'
}

export class AuthService {
  /**
   * Get or create user profile after OAuth login
   * This should be called in the OAuth callback handler
   */
  async getOrCreateProfile(userId: string): Promise<Profile | null> {
    'use server'
    
    const supabase = await createServerClient()
    
    // First try to get existing profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (existingProfile) return existingProfile

    // Get user data for profile creation
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Create new profile with default settings
    const profileData: ProfileInsert = {
      id: userId,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      settings: DEFAULT_SETTINGS
    }

    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return null
    }

    return newProfile
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
    'use server'
    
    const supabase = await createServerClient()
    
    // Validate settings if provided
    if (updates.settings) {
      const validatedSettings = this.validateSettings(updates.settings as any)
      updates.settings = validatedSettings
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }

    return data
  }

  /**
   * Get current user profile
   */
  async getCurrentProfile(): Promise<Profile | null> {
    'use server'
    
    const supabase = await createServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile
  }

  /**
   * Sign out user (client-side only)
   */
  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      return false
    }
    
    return true
  }

  /**
   * Validate profile settings against our schema
   * Since pg_jsonschema is not available, we validate in the app layer
   */
  private validateSettings(settings: any): typeof DEFAULT_SETTINGS {
    const validated = { ...DEFAULT_SETTINGS }
    
    if (settings.theme && ['light', 'dark', 'auto'].includes(settings.theme)) {
      validated.theme = settings.theme
    }
    
    if (typeof settings.autoLabeling === 'boolean') {
      validated.autoLabeling = settings.autoLabeling
    }
    
    if (settings.syncFrequency && ['realtime', 'hourly', 'daily'].includes(settings.syncFrequency)) {
      validated.syncFrequency = settings.syncFrequency
    }
    
    return validated
  }
}

// Export singleton instance
export const authService = new AuthService()
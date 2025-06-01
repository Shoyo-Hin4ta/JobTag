import { createClient } from '@/lib/supabase/client'

export type OAuthProvider = 'google' | 'azure'

export interface OAuthConfig {
  provider: OAuthProvider
  redirectTo: string
  scopes?: string[]
}

const OAUTH_SCOPES = {
  google: [
    'email',
    'profile',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.labels',
    'https://www.googleapis.com/auth/gmail.modify'
  ],
  azure: [
    'email',
    'offline_access',
    'https://graph.microsoft.com/Mail.Read',
    'https://graph.microsoft.com/Mail.ReadWrite'
  ]
}

export async function signInWithOAuth({ provider, redirectTo, scopes }: OAuthConfig) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      scopes: (scopes || OAUTH_SCOPES[provider]).join(' '),
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
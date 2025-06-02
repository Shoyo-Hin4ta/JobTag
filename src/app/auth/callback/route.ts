import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth-service'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Create or get profile using our service
        const profile = await authService.getOrCreateProfile(user.id)
        
        if (profile) {
          // Check if user needs onboarding
          const needsOnboarding = !profile.full_name || profile.full_name === user.email?.split('@')[0]
          
          if (needsOnboarding) {
            return NextResponse.redirect(new URL('/auth/onboarding', requestUrl.origin))
          }
          
          // Redirect to the originally requested page or dashboard
          return NextResponse.redirect(new URL(next, requestUrl.origin))
        }
      }
    }
  }

  // Something went wrong, redirect to login with error
  return NextResponse.redirect(new URL('/auth/login?error=callback_failed', requestUrl.origin))
}
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SpaceBackground } from '@/components/custom/space-background'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      
      if (error) {
        console.error('Error during OAuth callback:', error)
        router.push('/auth/login?error=callback_failed')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarded')
          .eq('id', user.id)
          .single()

        if (profile?.onboarded) {
          router.push('/dashboard')
        } else {
          router.push('/auth/onboarding')
        }
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <SpaceBackground />
      
      <div className="relative z-10 text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="w-full h-full rounded-full border-4 border-cosmic-blue border-t-transparent animate-spin" />
        </div>
        <h2 className="text-xl font-medium text-gray-300">
          Authenticating your mission...
        </h2>
        <p className="text-sm text-gray-500">
          Please wait while we verify your credentials
        </p>
      </div>
    </div>
  )
}
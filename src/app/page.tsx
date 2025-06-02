"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

// Dynamically import GSAP page to avoid SSR issues
const GSAPScrollytellingPage = dynamic(
  () => import('./gsap-page'),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-space-dark">
        <div className="text-white text-2xl animate-pulse">Loading magical experience...</div>
      </div>
    )
  }
)

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      console.log('[Landing Page] Auth check:', { isAuthenticated: !!user, userId: user?.id })
      
      if (user) {
        console.log('[Landing Page] User authenticated, redirecting to dashboard')
        router.push('/dashboard')
      }
    }
    
    checkAuth()
  }, [router])

  return <GSAPScrollytellingPage />
}
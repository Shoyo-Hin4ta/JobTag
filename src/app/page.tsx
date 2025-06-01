"use client"

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
  return <GSAPScrollytellingPage />
}
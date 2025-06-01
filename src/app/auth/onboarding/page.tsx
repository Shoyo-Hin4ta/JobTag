import { Metadata } from 'next'
import { OnboardingFlow } from '@/components/auth/onboarding-flow'
import { SpaceBackground } from '@/components/custom/space-background'
import { FloatingParticles } from '@/components/custom/floating-particles'

export const metadata: Metadata = {
  title: 'Welcome - JobTag',
  description: 'Complete your setup to start tracking job applications'
}

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <SpaceBackground />
      <FloatingParticles />
      
      <div className="relative z-10 w-full px-6 py-12">
        <OnboardingFlow />
      </div>
    </div>
  )
}
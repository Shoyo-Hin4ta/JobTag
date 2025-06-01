'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to JobTag!',
    description: 'Your AI-powered job tracking mission control is ready',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
          className="stroke-cosmic-blue"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 11L8 7M12 11l4-4M12 11v6"
          className="stroke-cosmic-gold"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    id: 'permissions',
    title: 'Email Access Permission',
    description: 'We need permission to read and label your job-related emails',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
        <rect
          x="2"
          y="4"
          width="20"
          height="16"
          rx="2"
          className="stroke-nebula-purple"
          strokeWidth="2"
        />
        <path
          d="M22 6l-10 7L2 6"
          className="stroke-cosmic-blue"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Your dashboard is ready. Let\'s start tracking applications!',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          className="stroke-cosmic-gold"
          strokeWidth="2"
        />
        <path
          d="M8 12l2 2 4-4"
          className="stroke-cosmic-gold"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('profiles')
          .update({ onboarded: true })
          .eq('id', user.id)
      }
      
      router.push('/dashboard')
    }
  }

  const step = steps[currentStep]

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="flex justify-center space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-2 w-16 rounded-full transition-all duration-300',
              index <= currentStep
                ? 'bg-gradient-to-r from-nebula-purple to-cosmic-blue'
                : 'bg-gray-700'
            )}
          />
        ))}
      </div>

      <div className="glass-card rounded-2xl p-8 space-y-6 text-center">
        <div className="flex justify-center">{step.icon}</div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-nebula-purple to-cosmic-blue bg-clip-text text-transparent">
            {step.title}
          </h2>
          <p className="text-gray-400">{step.description}</p>
        </div>

        {currentStep === 1 && (
          <div className="text-sm text-gray-500 space-y-2">
            <p>We will:</p>
            <ul className="space-y-1">
              <li>• Read job-related emails only</li>
              <li>• Auto-label them in your inbox</li>
              <li>• Extract application details</li>
              <li>• Never access personal emails</li>
            </ul>
          </div>
        )}

        <Button
          onClick={handleNext}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-nebula-purple to-cosmic-blue hover:opacity-90 transition-opacity"
          size="lg"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : currentStep === steps.length - 1 ? (
            'Launch Dashboard'
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  )
}
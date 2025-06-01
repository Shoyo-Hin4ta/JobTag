import { Metadata } from 'next'
import Link from 'next/link'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { SpaceBackground } from '@/components/custom/space-background'
import { FloatingParticles } from '@/components/custom/floating-particles'

export const metadata: Metadata = {
  title: 'Login - JobTag',
  description: 'Sign in to track your job applications across the galaxy'
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <SpaceBackground />
      <FloatingParticles />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-nebula-purple to-cosmic-blue bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to continue tracking your career journey
            </p>
          </div>

          <div className="space-y-4">
            <OAuthButtons redirectTo="/auth/callback" />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-space-dark/80 backdrop-blur-sm text-gray-400">
                Secure OAuth authentication
              </span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-400">
              By signing in, you agree to connect your email for job tracking
            </p>
            
            <Link 
              href="/"
              className="text-sm text-cosmic-blue hover:text-cosmic-gold transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your data is encrypted and secure. We only access job-related emails.
          </p>
        </div>
      </div>
    </div>
  )
}
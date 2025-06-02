import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/dashboard/sidebar'
import MobileNav from '@/components/dashboard/mobile-nav'
import { SpaceBackground } from '@/components/custom/space-background'
import { Toaster } from 'sonner'

export default async function DashboardLayout({
  children
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Space Background - Subtle animation */}
      <div className="fixed inset-0 -z-10">
        <SpaceBackground />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-black/40 backdrop-blur-2xl border-r border-white/10">
        <DashboardSidebar user={user} />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="relative z-10">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-t border-white/10 z-50">
        <MobileNav />
      </nav>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </div>
  )
}
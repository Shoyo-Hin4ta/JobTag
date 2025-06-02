'use client'

import { User } from '@supabase/supabase-js'
import { Home, ChartBar, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import RealtimeStats from './realtime-stats'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  disabled?: boolean
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: ChartBar },
  { name: 'Settings', href: '/settings', icon: Settings, disabled: true },
]

interface DashboardSidebarProps {
  user: User
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<HTMLLIElement[]>([])

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      )

      gsap.fromTo(
        navItemsRef.current,
        { x: -20, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.1,
          delay: 0.3,
          ease: 'power2.out' 
        }
      )
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const addToRefs = (el: HTMLLIElement | null, index: number) => {
    if (el) navItemsRef.current[index] = el
  }

  return (
    <div ref={sidebarRef} className="flex flex-col h-full p-6">
      {/* User Profile Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
            {user.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.email?.split('@')[0]}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.name} ref={(el) => addToRefs(el, index)}>
                <Link
                  href={item.disabled ? '#' : item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}
                    ${isActive ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50' : ''}
                    group
                  `}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  <Icon 
                    className={`
                      w-5 h-5 transition-all duration-200
                      ${isActive ? 'text-purple-300' : 'text-gray-400 group-hover:text-white'}
                      ${!item.disabled && 'group-hover:scale-110'}
                    `} 
                  />
                  <span className={`
                    text-sm font-medium transition-colors duration-200
                    ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                  `}>
                    {item.name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Quick Stats
        </h3>
        <RealtimeStats userId={user.id} />
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-red-500/20 group"
      >
        <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
        <span className="text-sm font-medium text-gray-300 group-hover:text-red-400 transition-colors duration-200">
          Logout
        </span>
      </button>
    </div>
  )
}
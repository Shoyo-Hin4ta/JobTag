'use client'

import { Home, Plus, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Add', href: '#', icon: Plus, isAction: true },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()

  const handleAddClick = () => {
    // This will be handled by the parent component to open the add modal
    const event = new CustomEvent('openAddApplication')
    window.dispatchEvent(event)
  }

  return (
    <div className="flex items-center justify-around py-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        if (item.isAction) {
          return (
            <button
              key={item.name}
              onClick={handleAddClick}
              className="relative p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30 transform transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <Icon className="w-6 h-6 text-white" />
            </button>
          )
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              p-3 rounded-xl transition-all duration-200
              ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
            `}
          >
            <Icon 
              className={`
                w-6 h-6 transition-colors duration-200
                ${isActive ? 'text-purple-400' : 'text-gray-400'}
              `} 
            />
          </Link>
        )
      })}
    </div>
  )
}
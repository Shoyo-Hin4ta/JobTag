'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const STATUS_COLORS = {
  all: { bg: 'bg-gray-500/20', text: 'text-gray-200', border: 'border-gray-500/50' },
  applied: { bg: 'bg-yellow-500/20', text: 'text-yellow-200', border: 'border-yellow-500/50' },
  interview: { bg: 'bg-blue-500/20', text: 'text-blue-200', border: 'border-blue-500/50' },
  offer: { bg: 'bg-green-500/20', text: 'text-green-200', border: 'border-green-500/50' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-200', border: 'border-red-500/50' },
}

interface FilterPillProps {
  label: string
  value: string
  icon?: string
  count: number
  active: boolean
  onClick: () => void
}

function FilterPill({ label, value, icon, count, active, onClick }: FilterPillProps) {
  const colors = STATUS_COLORS[value as keyof typeof STATUS_COLORS] || STATUS_COLORS.all

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200
        ${active 
          ? `${colors.bg} ${colors.border} ${colors.text} border` 
          : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
        }
      `}
    >
      {icon && <span>{icon}</span>}
      <span className="text-sm font-medium">{label}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-white/10'}`}>
        {count}
      </span>
    </button>
  )
}

interface StatusFiltersProps {
  applications?: any[]
}

export default function StatusFilters({ applications = [] }: StatusFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get('status') || 'all'

  // Calculate real counts
  const counts = {
    all: applications.length,
    interview: applications.filter(app => 
      ['screening', 'interview', 'technical', 'final'].includes(app.status)
    ).length,
    applied: applications.filter(app => app.status === 'applied').length,
    offer: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  }

  const filters = [
    { label: 'All', value: 'all', count: counts.all },
    { label: 'In Progress', value: 'interview', icon: '🔵', count: counts.interview },
    { label: 'Pending', value: 'applied', icon: '🟡', count: counts.applied },
    { label: 'Offers', value: 'offer', icon: '🟢', count: counts.offer },
    { label: 'Rejected', value: 'rejected', icon: '🔴', count: counts.rejected },
  ]

  const handleFilterClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
      <div className="flex gap-2 min-w-max md:flex-wrap">
        {filters.map(filter => (
          <FilterPill
            key={filter.value}
            {...filter}
            active={currentFilter === filter.value}
            onClick={() => handleFilterClick(filter.value)}
          />
        ))}
      </div>
    </div>
  )
}
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  trend?: string
  trendUp?: boolean
}

export default function StatsCard({ title, value, icon, trend, trendUp }: StatsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      )
    }

    if (valueRef.current && typeof value === 'number') {
      gsap.fromTo(
        valueRef.current,
        { textContent: 0 },
        {
          textContent: value,
          duration: 1.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            if (valueRef.current) {
              valueRef.current.textContent = Math.floor(this.targets()[0].textContent).toString()
            }
          }
        }
      )
    }
  }, [value])

  return (
    <div
      ref={cardRef}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-xs ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">
          {typeof value === 'number' ? (
            <span ref={valueRef}>0</span>
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  )
}
"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { useSpring, animated } from "@react-spring/web"

const stats = [
  { value: 95, suffix: "%", label: "Parsing Accuracy" },
  { value: 10, suffix: "x", label: "Faster Tracking" },
  { value: 0, suffix: "", label: "Manual Entry" }
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const { number } = useSpring({
    from: { number: 0 },
    to: { number: isInView ? value : 0 },
    config: { duration: 2000 }
  })

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold gradient-text">
      <animated.span>
        {number.to(n => Math.floor(n))}
      </animated.span>
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  return (
    <section ref={ref} className="py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          style={{ y }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <motion.div 
                className="space-y-2"
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  delay: index * 0.3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p className="text-lg text-muted-foreground">{stat.label}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
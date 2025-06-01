"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Brain, FolderOpen, Satellite } from "lucide-react"
import { GlassCard } from "@/components/custom/glass-card"
import { useRef } from "react"

const features = [
  {
    icon: Brain,
    title: "AI Email Parser",
    description: "Our AI reads your job emails and extracts all the important details automatically",
    color: "text-primary",
    direction: -1
  },
  {
    icon: FolderOpen,
    title: "Auto-Organization",
    description: "Emails are automatically labeled and organized in your inbox by company and status",
    color: "text-secondary",
    direction: 1
  },
  {
    icon: Satellite,
    title: "Real-time Tracking",
    description: "Watch your applications update in real-time as new emails arrive",
    color: "text-accent",
    direction: -1
  }
]

export function FeaturesSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const xLeft = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"])
  const xRight = useTransform(scrollYProgress, [0, 1], ["-100px", "100px"])
  return (
    <section ref={ref} className="py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Supercharge Your Job Hunt
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop manually tracking applications. Let AI do the heavy lifting while you focus on landing interviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              style={{ 
                x: feature.direction === -1 ? xLeft : xRight 
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard variant="hoverable" className="h-full">
                <motion.div 
                  className="flex flex-col items-center text-center space-y-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className={`p-3 rounded-full bg-primary/10 ${feature.color}`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
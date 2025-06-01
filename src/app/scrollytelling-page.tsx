"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Rocket, Brain, FolderOpen, Satellite, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/custom/glass-card"

export default function ScrollytellingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })

  // Scene transitions
  const scene1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0])
  const scene2Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.4, 0.5], [0, 1, 1, 0])
  const scene3Opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [0, 1, 1, 0])
  const scene4Opacity = useTransform(scrollYProgress, [0.65, 0.75, 0.9, 1], [0, 1, 1, 0])
  
  const scene2Y = useTransform(scrollYProgress, [0.15, 0.25], ["100%", "0%"])
  const scene3Scale = useTransform(scrollYProgress, [0.4, 0.5], [0, 1])

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Scene 1: Hero */}
      <motion.section 
        className="h-screen sticky top-0 flex items-center justify-center"
        style={{ opacity: scene1Opacity }}
      >
        <div className="text-center px-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Track Jobs{" "}
            <span className="gradient-text">While Sleeping</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Your inbox becomes mission control for your career
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Button size="lg" className="gradient-primary">
              <Rocket className="mr-2" />
              Launch Your Job Search
            </Button>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="h-8 w-8 text-muted-foreground" />
          </motion.div>
        </div>
      </motion.section>

      {/* Spacer for scroll */}
      <div className="h-screen" />

      {/* Scene 2: Features */}
      <motion.section 
        className="h-screen sticky top-0 flex items-center justify-center"
        style={{ opacity: scene2Opacity, y: scene2Y }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl">
          {[
            { icon: Brain, title: "AI Parsing", delay: 0 },
            { icon: FolderOpen, title: "Auto-Organize", delay: 0.2 },
            { icon: Satellite, title: "Real-time", delay: 0.4 }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay }}
            >
              <GlassCard className="text-center p-8">
                <feature.icon className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Spacer */}
      <div className="h-screen" />

      {/* Scene 3: Demo */}
      <motion.section 
        className="h-screen sticky top-0 flex items-center justify-center"
        style={{ opacity: scene3Opacity, scale: scene3Scale }}
      >
        <div className="text-center px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-12">
            Watch the <span className="gradient-text">Magic</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-4">Before</h3>
              <div className="space-y-2 text-left">
                <div className="text-muted-foreground">✉️ Re: Your application...</div>
                <div className="text-muted-foreground">✉️ Interview invitation...</div>
                <div className="text-muted-foreground">✉️ Thank you for...</div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-4">After</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Google</span>
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded">Applied</span>
                </div>
                <div className="flex justify-between">
                  <span>Meta</span>
                  <span className="text-xs bg-purple-500 px-2 py-1 rounded">Interview</span>
                </div>
                <div className="flex justify-between">
                  <span>Netflix</span>
                  <span className="text-xs bg-red-500 px-2 py-1 rounded">Applied</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.section>

      {/* Spacer */}
      <div className="h-screen" />

      {/* Scene 4: CTA */}
      <motion.section 
        className="h-screen sticky top-0 flex items-center justify-center"
        style={{ opacity: scene4Opacity }}
      >
        <div className="text-center px-4">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
          >
            Ready to <span className="gradient-text">Launch?</span>
          </motion.h2>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button size="lg" className="gradient-primary text-xl px-8 py-6">
              Start Free Mission
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Final spacer */}
      <div className="h-screen" />
    </div>
  )
}
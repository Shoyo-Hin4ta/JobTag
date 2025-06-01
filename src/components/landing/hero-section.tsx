"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto text-center"
        style={{ y, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Track Jobs{" "}
            <span className="gradient-text">While Sleeping</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your inbox becomes mission control for your career. AI-powered email parsing 
            organizes your job hunt automatically.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity group"
            >
              <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              Launch Your Job Search
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
              onClick={() => {
                document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              See Demo
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Floating astronaut illustration with parallax */}
      <motion.div
        className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]) 
        }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
        </motion.div>
      </motion.div>
    </section>
  )
}
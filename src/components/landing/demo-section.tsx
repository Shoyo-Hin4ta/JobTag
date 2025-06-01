"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Mail, Tag } from "lucide-react"
import { GlassCard } from "@/components/custom/glass-card"
import { useRef } from "react"
import { useSpring, animated } from "@react-spring/web"

export function DemoSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  
  const arrowProps = useSpring({
    from: { x: 0 },
    to: { x: 20 },
    config: { tension: 300, friction: 10 },
    loop: { reverse: true },
  })
  return (
    <section ref={ref} id="demo" className="py-20 px-4 overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto"
        style={{ scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See the Magic Happen
          </h2>
          <p className="text-lg text-muted-foreground">
            Watch how messy inbox transforms into organized job tracking
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-auto"
          >
            <GlassCard className="relative overflow-hidden">
              <div className="absolute top-4 left-4 text-sm text-muted-foreground">Before</div>
              <div className="pt-12 space-y-3">
                {[
                  "Re: Your application to Google",
                  "Interview invitation - Meta",
                  "Thank you for applying - Netflix",
                  "Next steps with Amazon",
                  "We received your application - Apple"
                ].map((subject, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-muted/50 rounded">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{subject}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="hidden lg:block px-8"
          >
            <animated.div style={arrowProps}>
              <ArrowRight className="h-12 w-12 text-primary" />
            </animated.div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-auto"
          >
            <GlassCard className="relative overflow-hidden">
              <div className="absolute top-4 left-4 text-sm text-muted-foreground">After</div>
              <div className="pt-12 space-y-3">
                {[
                  { company: "Google", status: "Applied", color: "bg-blue-500" },
                  { company: "Meta", status: "Interview", color: "bg-purple-500" },
                  { company: "Netflix", status: "Applied", color: "bg-red-500" },
                  { company: "Amazon", status: "Screening", color: "bg-orange-500" },
                  { company: "Apple", status: "Applied", color: "bg-gray-500" }
                ].map((job, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center space-x-3">
                      <Tag className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{job.company}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${job.color} text-white`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
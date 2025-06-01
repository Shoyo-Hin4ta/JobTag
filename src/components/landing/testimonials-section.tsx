"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { GlassCard } from "@/components/custom/glass-card"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    content: "JobTag transformed my chaotic job search into an organized mission. I landed my dream job at SpaceX!",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager",
    content: "The auto-labeling feature is incredible. My Gmail looks like a professional ATS system now.",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Emily Watson",
    role: "Data Scientist",
    content: "I was tracking 50+ applications in a spreadsheet. JobTag does it automatically from my emails!",
    rating: 5,
    avatar: "EW"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join 1,000+ Job Seekers
          </h2>
          <p className="text-lg text-muted-foreground">
            Who've upgraded their job hunt to the space age
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard variant="hoverable" className="h-full animate-float" style={{ animationDelay: `${index * 2}s` }}>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
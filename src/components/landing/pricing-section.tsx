"use client"

import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/custom/glass-card"

const plans = [
  {
    name: "Free Forever",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "50 applications/month",
      "Gmail & Outlook support",
      "Basic email parsing",
      "Auto-labeling",
      "Dashboard analytics"
    ],
    cta: "Start Free",
    variant: "outline" as const
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious job seekers",
    features: [
      "Unlimited applications",
      "Priority AI parsing",
      "Advanced analytics",
      "Export to CSV/PDF",
      "Email notifications",
      "Priority support"
    ],
    cta: "Go Pro",
    variant: "default" as const,
    popular: true
  }
]

export function PricingSection() {
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more power
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Sparkles className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <GlassCard variant={plan.popular ? "glowing" : "default"} className="h-full">
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={plan.popular ? "gradient-primary text-primary-foreground w-full" : "w-full"}
                    variant={plan.variant}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
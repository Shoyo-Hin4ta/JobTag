import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hoverable" | "glowing"
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card",
          {
            "hover:scale-[1.02] cursor-pointer transition-transform": variant === "hoverable",
            "animate-pulse-glow": variant === "glowing",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"

export { GlassCard }
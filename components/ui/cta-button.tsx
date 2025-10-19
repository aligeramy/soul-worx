import Link from "next/link"
import { cn } from "@/lib/utils"

interface CTAButtonProps {
  href: string
  variant?: "primary" | "secondary" | "tertiary"
  children: React.ReactNode
  className?: string
  showArrow?: boolean
  style?: React.CSSProperties
}

export function CTAButton({ 
  href, 
  variant = "primary", 
  children, 
  className,
  showArrow = true,
  style
}: CTAButtonProps) {
  const variants = {
    primary: "px-8 py-3 border-1 border-white/10 rounded-lg hover:border-white bg-brand-bg-darker/50 transition-all duration-300 backdrop-blur-sm text-white",
    secondary: "px-6 py-3 bg-brand-bg-darker text-white font-semibold rounded-lg hover:bg-brand-bg/90 transition-all duration-300 hover:scale-105 shadow-lg text-sm",
    tertiary: "px-6 py-3 bg-white border-2 border-black/10 text-black font-semibold rounded-full hover:bg-black/5 transition-all duration-300 text-sm"
  }

  return (
    <Link 
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center",
        variants[variant],
        className
      )}
      style={style}
    >
      <span className={variant === "primary" ? "text-2xl font-normal font-monteci" : ""}>
        {children}
      </span>
      {showArrow && (
        <svg 
          className="w-5 h-5 ml-3 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      )}
    </Link>
  )
}


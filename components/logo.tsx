import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "app-icon" | "light" | "dark"
  priority?: boolean
}

const sizeMap = {
  sm: { width: 40, height: 60, className: "h-12 w-auto" },
  md: { width: 50, height: 75, className: "h-16 w-auto" },
  lg: { width: 64, height: 96, className: "h-20 w-auto" },
  xl: { width: 80, height: 120, className: "h-24 w-auto" },
}

export function Logo({ 
  href = "/", 
  className, 
  size = "md", 
  variant = "default",
  priority = false 
}: LogoProps) {
  const sizeConfig = sizeMap[size]
  
  // Determine image source and styling based on variant
  const getLogoConfig = () => {
    switch (variant) {
      case "app-icon":
        return {
          src: "/logo-v2/b.png",
          alt: "Soulworx",
          classes: ""
        }
      case "light":
        return {
          src: "/logo-v2/w.png",
          alt: "SoulWorx Logo",
          classes: ""
        }
      case "dark":
        return {
          src: "/logo-v2/b.png",
          alt: "SoulWorx Logo",
          classes: ""
        }
      default:
        return {
          src: "/logo-v2/b.png",
          alt: "SoulWorx Logo",
          classes: ""
        }
    }
  }

  const logoConfig = getLogoConfig()

  const LogoImage = (
    <Image
      src={logoConfig.src}
      alt={logoConfig.alt}
      width={sizeConfig.width}
      height={sizeConfig.height}
      className={cn(
        sizeConfig.className,
        logoConfig.classes,
        "transition-transform duration-200 hover:scale-105 relative top-1 p-2",
        className
      )}
      priority={priority}
    />
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {LogoImage}
      </Link>
    )
  }

  return LogoImage
}


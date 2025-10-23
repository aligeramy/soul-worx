"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { navigationConfig } from "@/config/navigation"
import { ShoppingCart, User } from "lucide-react"
import { Logo } from "@/components/logo"

interface CompactStickyNavProps {
  hasSession: boolean
}

export function CompactStickyNav({ hasSession }: CompactStickyNavProps) {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const isTransparent = isHomepage || pathname.includes('/events/')

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav after scrolling past 100vh
      const scrollPosition = window.scrollY
      const viewportHeight = window.innerHeight
      setIsVisible(scrollPosition > viewportHeight)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed top-0 left-0 right-0 z-50 border-b shadow-lg transition-colors duration-300 ${
            isTransparent 
              ? "bg-black/60 backdrop-blur-xl border-white/10" 
              : "bg-background/95 backdrop-blur-xl border-border"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center justify-between w-full">
                {/* Left Menu Items */}
                <div className="flex items-center gap-6">
                  {navigationConfig.left.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`text-sm font-medium transition-colors ${
                        isTransparent 
                          ? "text-white hover:text-white/80" 
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Center Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <Logo 
                    href="/" 
                    size="sm" 
                    variant={isTransparent ? "light" : "dark"}
                    priority
                  />
                </div>

                {/* Right Menu Items */}
                <div className="flex items-center gap-6">
                  {navigationConfig.right.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`text-sm font-medium transition-colors ${
                        isTransparent 
                          ? "text-white hover:text-white/80" 
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* User & Cart Icons */}
                  <div className="flex items-center gap-3 ml-2">
                    <Link
                      href={hasSession ? "/dashboard" : "/signin"}
                      className={`transition-colors ${
                        isTransparent 
                          ? "text-white hover:text-white/80" 
                          : "text-foreground hover:text-primary"
                      }`}
                      aria-label={hasSession ? "Dashboard" : "Sign In"}
                    >
                      <User className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/shop"
                      className={`transition-colors ${
                        isTransparent 
                          ? "text-white hover:text-white/80" 
                          : "text-foreground hover:text-primary"
                      }`}
                      aria-label="Cart"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex lg:hidden items-center justify-between w-full">
                {/* Mobile Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <Logo 
                    href="/" 
                    size="sm" 
                    variant={isTransparent ? "light" : "dark"}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Link
                    href={hasSession ? "/dashboard" : "/signin"}
                    className={`transition-colors ${
                      isTransparent 
                        ? "text-white hover:text-white/80" 
                        : "text-foreground hover:text-primary"
                    }`}
                    aria-label={hasSession ? "Dashboard" : "Sign In"}
                  >
                    <User className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/shop"
                    className={`transition-colors ${
                      isTransparent 
                        ? "text-white hover:text-white/80" 
                        : "text-foreground hover:text-primary"
                    }`}
                    aria-label="Cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}


"use client"

import { useState, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { NavigationMenu } from "@/components/navigation/navigation-menu"
import { MegaMenu } from "@/components/navigation/mega-menu"
import { MobileMenu } from "@/components/navigation/mobile-menu"
import { usePathname } from "next/navigation"
import { navigationConfig, type NavigationItem } from "@/config/navigation"
import { Logo } from "@/components/logo"

export function Navigation() {
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const isTransparent = isHomepage || pathname.includes('/events/')
  
  const [activeSubmenu, setActiveSubmenu] = useState<NavigationItem["submenu"] | undefined>()
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const navContainerRef = useRef<HTMLDivElement>(null)

  const handleMenuItemEnter = (submenu?: NavigationItem["submenu"]) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    
    if (submenu) {
      setActiveSubmenu(submenu)
      setIsSubmenuVisible(true)
    }
  }

  const handleMenuItemLeave = () => {
    // Don't close immediately - wait to see if user moves to submenu
    closeTimeoutRef.current = setTimeout(() => {
      setIsSubmenuVisible(false)
    }, 150)
  }

  const handleSubmenuEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setIsSubmenuVisible(true)
  }

  const handleSubmenuLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsSubmenuVisible(false)
      setActiveSubmenu(undefined)
    }, 150)
  }

  return (
    <>
      <div 
        ref={navContainerRef}
        className="relative z-50"
      >
        <nav 
          className={`relative w-full border-t border-b transition-colors duration-300 ${
            isTransparent 
              ? "bg-black/50 supports-[backdrop-filter]:bg-black/20 backdrop-blur-md border-white/10" 
              : "bg-background/95 backdrop-blur-md border-border"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center justify-between w-full">
                {/* Left Menu Items */}
                <div className="flex items-center gap-8">
                  {navigationConfig.left.map((item) => (
                    <NavigationMenu 
                      key={item.label} 
                      item={item} 
                      isLight={isTransparent}
                      onMouseEnter={() => handleMenuItemEnter(item.submenu)}
                      onMouseLeave={handleMenuItemLeave}
                    />
                  ))}
                </div>

                {/* Center Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <Logo 
                    href="/" 
                    size="md" 
                    variant={isTransparent ? "light" : "dark"}
                    priority
                  />
                </div>

                {/* Right Menu Items */}
                <div className="flex items-center gap-8">
                  {navigationConfig.right.map((item) => (
                    <NavigationMenu 
                      key={item.label} 
                      item={item} 
                      isLight={isTransparent}
                      onMouseEnter={() => handleMenuItemEnter(item.submenu)}
                      onMouseLeave={handleMenuItemLeave}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex lg:hidden items-center justify-between w-full">
                <MobileMenu isLight={isTransparent} />
                
                {/* Mobile Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <Logo 
                    href="/" 
                    size="sm" 
                    variant={isTransparent ? "light" : "dark"}
                    priority
                  />
                </div>
                
                <div className="w-10" />
              </div>
            </div>
          </div>
        </nav>

        {/* Mega Menu Submenu */}
        <AnimatePresence>
          {activeSubmenu && isSubmenuVisible && (
            <MegaMenu
              items={activeSubmenu}
              isLight={isTransparent}
              isOpen={isSubmenuVisible}
              onMouseEnter={handleSubmenuEnter}
              onMouseLeave={handleSubmenuLeave}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

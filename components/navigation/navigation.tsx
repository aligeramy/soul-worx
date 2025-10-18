"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { NavigationMenu } from "@/components/navigation/navigation-menu"
import { MobileMenu } from "@/components/navigation/mobile-menu"
import { CartButton } from "@/components/shop/cart-button"
import { usePathname } from "next/navigation"
import { navigationConfig, type NavigationItem } from "@/config/navigation"

export function Navigation() {
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  // Transparent nav on homepage and event pages with hero images
  const isTransparent = isHomepage || pathname.includes('/events/')
  const [activeSubmenu, setActiveSubmenu] = useState<NavigationItem["submenu"] | undefined>()
  const [activeParent, setActiveParent] = useState<string>("")
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const submenuTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleSubmenuChange = useCallback((isOpen: boolean, submenu: NavigationItem["submenu"], parentLabel: string) => {
    // Always clear any existing timeout
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current)
      submenuTimeoutRef.current = undefined
    }

    if (isOpen && submenu) {
      // Instant open for smooth experience - update immediately
      setActiveSubmenu(submenu)
      setActiveParent(parentLabel)
      setIsSubmenuOpen(true)
    } else {
      // Longer delay before closing to allow moving to submenu
      submenuTimeoutRef.current = setTimeout(() => {
        setIsSubmenuOpen(false)
        setActiveSubmenu(undefined)
        setActiveParent("")
      }, 500)
    }
  }, [])

  const handleSubmenuBarMouseEnter = useCallback(() => {
    // Clear any close timeout when entering submenu
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current)
      submenuTimeoutRef.current = undefined
    }
    setIsSubmenuOpen(true)
  }, [])

  const handleSubmenuBarMouseLeave = useCallback(() => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current)
      submenuTimeoutRef.current = undefined
    }
    // Close after delay when leaving submenu
    submenuTimeoutRef.current = setTimeout(() => {
      setIsSubmenuOpen(false)
      setActiveSubmenu(undefined)
      setActiveParent("")
    }, 500)
  }, [])

  return (
    <>
      <nav className={`fixed top-12 left-0 right-0 z-50  border-t border-white/10 border-b transition-colors duration-300 ${
        isTransparent 
          ? "bg-black/20 backdrop-blur-md border-white/10" 
          : "bg-background/95 backdrop-blur-md border-border"
      }`}>
        <div className="container mx-auto px-4 ">
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
                    onSubmenuChange={handleSubmenuChange}
                  />
                ))}
              </div>

              {/* Center Logo */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <Image
                  src="/logo/svg/logo.svg"
                  alt="SoulWorx Logo"
                  width={50}
                  height={75}
                  className={`h-16 w-auto transition-transform duration-200 hover:scale-105 ${
                    isTransparent ? "invert brightness-0 contrast-200" : ""
                  }`}
                  priority
                />
              </Link>

              {/* Right Menu Items */}
              <div className="flex items-center gap-8">
                {navigationConfig.right.map((item) => (
                  <NavigationMenu 
                    key={item.label} 
                    item={item} 
                    isLight={isTransparent}
                    onSubmenuChange={handleSubmenuChange}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center justify-between w-full">
              <MobileMenu isLight={isTransparent} />
              
              {/* Mobile Logo */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <Image
                  src="/logo/svg/logo.svg"
                  alt="SoulWorx Logo"
                  width={40}
                  height={60}
                  className={`h-12 w-auto ${
                    isTransparent ? "invert brightness-0 contrast-200" : ""
                  }`}
                  priority
                />
              </Link>
              
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>
        </div>
      </nav>

      {/* Invisible bridge to seamlessly connect nav to submenu */}
      {activeSubmenu && (
        <div
          className="fixed left-0 right-0"
          style={{ 
            top: 'calc(3rem + 5rem)', // Start right at nav bottom
            height: '150px', // Very large bridge to ensure mouse is caught
            pointerEvents: 'auto',
            zIndex: 45,
            backgroundColor: 'rgba(0, 0, 0, 0.05)' // Temporary - so you can see it
          }}
          onMouseEnter={handleSubmenuBarMouseEnter}
          onMouseLeave={handleSubmenuBarMouseLeave}
        />
      )}

      {/* Submenu Bar - Appears below navigation with AnimatePresence */}
      <AnimatePresence mode="sync">
        {activeSubmenu && (
          <motion.div
            key={activeParent}
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: isSubmenuOpen ? 1 : 0, 
              y: isSubmenuOpen ? 0 : -10 
            }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className={`fixed left-0 right-0 border-b shadow-lg ${
              isTransparent 
                ? "bg-black/40 backdrop-blur-xl border-white/10" 
                : "bg-white/95 backdrop-blur-xl border-border"
            }`}
            style={{ 
              top: 'calc(3rem + 5rem)', // top-bar + nav (no visible gap)
              pointerEvents: 'auto',
              zIndex: 45
            }}
            onMouseEnter={handleSubmenuBarMouseEnter}
            onMouseLeave={handleSubmenuBarMouseLeave}
          >
            <div className="container mx-auto px-4 py-8 pt-12">
              <motion.div 
                className="flex items-start justify-center gap-16"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.1
                    }
                  }
                }}
              >
                {activeSubmenu.map((subItem) => (
                  <motion.div
                    key={subItem.href}
                    variants={{
                      hidden: { opacity: 0, y: -8 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }
                    }}
                  >
                    <Link
                      href={subItem.href}
                      className={`group flex flex-col gap-2 ${
                        isTransparent ? "text-white" : "text-foreground"
                      }`}
                    >
                      <motion.span 
                        className={`text-base font-semibold ${
                          isTransparent 
                            ? "group-hover:text-white/90" 
                            : "group-hover:text-primary"
                        }`}
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        {subItem.label}
                      </motion.span>
                      {subItem.description && (
                        <span className={`text-sm max-w-[200px] leading-relaxed ${
                          isTransparent ? "text-white/70" : "text-muted-foreground"
                        }`}>
                          {subItem.description}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

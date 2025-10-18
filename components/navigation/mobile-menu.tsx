"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { navigationConfig } from "@/config/navigation"

interface MobileMenuProps {
  isLight?: boolean
}

export function MobileMenu({ isLight = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([])

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const closeMenu = () => {
    setIsOpen(false)
    setOpenSubmenus([])
  }

  const iconColor = isLight ? "text-white" : "text-foreground"

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${iconColor}`}
        aria-label="Toggle menu"
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="fixed top-32 left-0 right-0 bottom-0 bg-background z-50 overflow-y-auto"
          >
            <motion.div 
              className="p-6 space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {/* Left Menu Items */}
              <div className="space-y-4">
                {navigationConfig.left.map((item) => (
                  <motion.div 
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        transition: {
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }
                    }}
                  >
                    {item.submenu ? (
                      <>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center justify-between w-full text-left text-lg font-medium py-2"
                        >
                          {item.label}
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleSubmenu(item.label)
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1"
                          >
                            <motion.div
                              animate={{ rotate: openSubmenus.includes(item.label) ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </motion.div>
                          </motion.button>
                        </Link>
                        <AnimatePresence>
                          {openSubmenus.includes(item.label) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pl-4 mt-2 space-y-2 overflow-hidden"
                            >
                              {item.submenu.map((subItem) => (
                                <motion.div
                                  key={subItem.href}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Link
                                    href={subItem.href}
                                    onClick={closeMenu}
                                    className="block py-2"
                                  >
                                    <div className="text-sm font-medium">
                                      {subItem.label}
                                    </div>
                                    {subItem.description && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {subItem.description}
                                      </div>
                                    )}
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block text-lg font-medium py-2"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <motion.div 
                className="border-t border-border"
                variants={{
                  hidden: { scaleX: 0 },
                  visible: { 
                    scaleX: 1,
                    transition: { duration: 0.3 }
                  }
                }}
              />

              {/* Right Menu Items */}
              <div className="space-y-4">
                {navigationConfig.right.map((item) => (
                  <motion.div 
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        transition: {
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }
                    }}
                  >
                    {item.submenu ? (
                      <>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center justify-between w-full text-left text-lg font-medium py-2"
                        >
                          {item.label}
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleSubmenu(item.label)
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1"
                          >
                            <motion.div
                              animate={{ rotate: openSubmenus.includes(item.label) ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </motion.div>
                          </motion.button>
                        </Link>
                        <AnimatePresence>
                          {openSubmenus.includes(item.label) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pl-4 mt-2 space-y-2 overflow-hidden"
                            >
                              {item.submenu.map((subItem) => (
                                <motion.div
                                  key={subItem.href}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Link
                                    href={subItem.href}
                                    onClick={closeMenu}
                                    className="block py-2"
                                  >
                                    <div className="text-sm font-medium">
                                      {subItem.label}
                                    </div>
                                    {subItem.description && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {subItem.description}
                                      </div>
                                    )}
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block text-lg font-medium py-2"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


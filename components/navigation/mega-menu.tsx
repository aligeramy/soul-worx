"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { NavigationItem } from "@/config/navigation"
import * as Icons from "lucide-react"

interface MegaMenuProps {
  items: NavigationItem[]
  isLight?: boolean
  isOpen: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function MegaMenu({ items, isLight = false, isOpen, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`absolute left-0 right-0 top-full border-b shadow-xl ${
        isLight 
          ? "bg-black/95 backdrop-blur-xl border-white/10" 
          : "bg-white backdrop-blur-xl border-border"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-start justify-center gap-8">
          {items.map((item) => {
            const IconComponent = item.icon ? Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> : null
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center gap-3 min-w-[140px] p-4 rounded-lg transition-all hover:scale-105"
              >
                {IconComponent && (
                  <div className={`p-3 rounded-full transition-colors ${
                    isLight 
                      ? "bg-white/10 group-hover:bg-white/20" 
                      : "bg-primary/10 group-hover:bg-primary/20"
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      isLight ? "text-white" : "text-primary"
                    }`} />
                  </div>
                )}
                <span className={`text-sm font-semibold text-center transition-colors ${
                  isLight 
                    ? "text-white group-hover:text-white/80" 
                    : "text-foreground group-hover:text-primary"
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}


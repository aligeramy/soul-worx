"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { NavigationItem } from "@/config/navigation"

interface NavigationMenuProps {
  item: NavigationItem
  isLight?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function NavigationMenu({ item, isLight = false, onMouseEnter, onMouseLeave }: NavigationMenuProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    onMouseEnter?.()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onMouseLeave?.()
  }

  const textColor = isLight ? "text-white hover:text-white/90" : "text-foreground hover:text-primary"
  const underlineColor = isLight ? "bg-white" : "bg-primary"

  if (!item.submenu || item.submenu.length === 0) {
    return (
      <Link
        href={item.href}
        className={`text-sm font-medium relative group ${textColor}`}
      >
        {item.label}
        <motion.span
          className={`absolute bottom-0 left-0 h-0.5 ${underlineColor}`}
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`flex items-center gap-1 text-sm font-medium relative group ${textColor}`}
      >
        {item.label}
        <motion.div
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
        <motion.span
          className={`absolute bottom-0 left-0 h-0.5 ${underlineColor}`}
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      </Link>
    </div>
  )
}

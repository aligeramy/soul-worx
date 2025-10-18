"use client"

import Link from "next/link"
import { Instagram, Twitter, Facebook } from "lucide-react"
import { usePathname } from "next/navigation"
import { UserMenuClient } from "./user-menu-client"
import { CartButton } from "@/components/shop/cart-button"

interface TopBarProps {
  hasSession: boolean
}

export function TopBar({ hasSession }: TopBarProps) {
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const isTransparent = isHomepage || pathname.includes('/events/')
  const textColor = isTransparent ? "text-white hover:text-white/80" : "text-foreground hover:text-primary"
  const borderColor = isTransparent ? "border-white/10" : "border-border"
  const bgColor = isTransparent ? "bg-black/20" : "bg-background/80"

  return (
    <div className={`w-full backdrop-blur-md border-b transition-colors ${bgColor} ${borderColor}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Left - Social Icons */}
          <div className="flex items-center gap-4">
            <Link
              href="https://instagram.com/soulworx"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${textColor}`}
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </Link>
            <Link
              href="https://twitter.com/soulworx"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${textColor}`}
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link
              href="https://facebook.com/soulworx"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${textColor}`}
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Link>
          </div>

          {/* Right - Account & Cart */}
          <div className="flex items-center gap-4">
            <UserMenuClient isHomepage={isTransparent} hasSession={hasSession} />
            
            <div className={isTransparent ? "[&_button]:text-white [&_button:hover]:text-white/80" : ""}>
              <CartButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

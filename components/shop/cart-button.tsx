"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "./cart-provider"
import { useState } from "react"
import { CartSlideout } from "./cart-slideout"

export function CartButton() {
  const { itemCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-black/10 rounded-lg transition-colors"
        aria-label="Shopping Cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold shadow-lg">
            {itemCount}
          </span>
        )}
      </button>
      <CartSlideout isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}


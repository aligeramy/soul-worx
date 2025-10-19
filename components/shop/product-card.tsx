"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ProductCardProps {
  id: string
  slug: string
  name: string
  price: string
  compareAtPrice?: string
  images: string[]
  status: string
  stock: number
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  compareAtPrice,
  images,
  status,
  stock,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAdding(true)
    addItem({
      id,
      name,
      price,
      image: images[0] || "/shop/placeholder.webp",
    })
    setTimeout(() => setIsAdding(false), 500)
  }

  const isOutOfStock = status === "sold_out" || stock === 0

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
      <Link href={`/shop/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={images[0] || "/shop/placeholder.webp"}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Product Title and Price on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-crimson font-bold text-xl text-white mb-2 line-clamp-1 group-hover:text-gold transition-colors duration-300">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-geist font-bold text-lg text-white">
                ${parseFloat(price).toFixed(2)}
              </span>
              {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
                <span className="text-xs text-white/70 line-through">
                  ${parseFloat(compareAtPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
              <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                SALE
              </span>
            )}
            {isOutOfStock && (
              <span className="px-3 py-1.5 bg-black/80 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          {!isOutOfStock && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button
                onClick={handleAddToCart}
                size="icon"
                className="rounded-full shadow-xl bg-white/95 backdrop-blur-sm hover:bg-white text-black hover:scale-110 transition-all duration-300"
                disabled={isAdding}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Stock Indicator */}
          {!isOutOfStock && stock < 10 && (
            <div className="absolute top-4 right-16">
              <span className="px-2 py-1 bg-orange-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                Only {stock} left
              </span>
            </div>
          )}
        </div>

      </Link>
    </div>
  )
}


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
  category?: string
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
  category,
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

  // Format category for display
  const displayCategory = category 
    ? category === "apparel" ? "APPAREL COLLECTION"
    : category === "accessories" ? "ACCESSORIES COLLECTION"
    : category === "books" ? "BOOK COLLECTION"
    : category === "digital" ? "DIGITAL COLLECTION"
    : "SHOP COLLECTION"
    : "SHOP COLLECTION"

  return (
    <div className="group relative transition-all duration-300 bg-neutral-100 rounded-lg p-3">
      <Link href={`/shop/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden mb-4">
          <Image
            src={images[0] || "/shop/placeholder.webp"}
            alt={name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
              <span className="px-3 py-1.5 border-1 border-brand-bg-darker text-brand-bg-darker text-xs font-bold rounded-full shadow-lg">
                SALE
              </span>
            )}
            {isOutOfStock && (
              <span className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-full shadow-lg">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          {!isOutOfStock && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <Button
                onClick={handleAddToCart}
                size="icon"
                className="rounded-full shadow-xl bg-black hover:bg-black/80 text-white hover:scale-110 transition-all duration-300"
                disabled={isAdding}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Stock Indicator */}
          {!isOutOfStock && stock < 10 && (
            <div className="absolute bottom-4 left-4 z-10">
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                Only {stock} left
              </span>
            </div>
          )}
        </div>

        {/* Product Info Below Image */}
        <div className="space-y-1 p-3">
          {/* Category */}
          <div className="text-neutral-500 text-xs font-medium uppercase tracking-wider">
            {displayCategory}
          </div>
          
          {/* Title */}
          <h3 className="font-crimson font-normal text-2xl  tracking-tight text-black group-hover:text-neutral-600 transition-colors duration-300">
            {name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="font-medium text-sm text-black">
              {parseFloat(price).toFixed(2)} CAD
            </span>
            {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
              <span className="text-xs text-neutral-400 line-through">
                {parseFloat(compareAtPrice).toFixed(2)} CAD
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}


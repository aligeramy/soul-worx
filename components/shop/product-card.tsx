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
  description: string
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
  description,
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
    <div className="group relative">
      <Link href={`/shop/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-neutral-100 rounded-2xl overflow-hidden mb-4">
          <Image
            src={images[0] || "/shop/placeholder.webp"}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                SALE
              </span>
            )}
            {isOutOfStock && (
              <span className="px-3 py-1 bg-neutral-900 text-white text-xs font-bold rounded-full">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          {!isOutOfStock && (
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={handleAddToCart}
                size="icon"
                className="rounded-full shadow-lg"
                disabled={isAdding}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-medium text-base group-hover:underline">
            {name}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="font-bold text-lg">${parseFloat(price).toFixed(2)}</span>
            {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
              <span className="text-sm text-neutral-500 line-through">
                ${parseFloat(compareAtPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}


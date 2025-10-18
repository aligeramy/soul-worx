"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-provider"
import { ArrowLeft, Check, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    description: string
    price: string
    compareAtPrice: string | null
    images: string[]
    status: string
    stock: number
    tags: string[]
    specifications: Record<string, string>
    variants: {
      id: string
      name: string
      price?: number
      sku?: string
      stock?: number
      attributes: { [key: string]: string }
    }[]
  }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const isOutOfStock = product.status === "sold_out" || product.stock === 0
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["/shop/placeholder.webp"]

  const handleAddToCart = () => {
    setIsAdding(true)
    
    const variant = product.variants?.find((v) => v.id === selectedVariant)
    addItem({
      id: product.id,
      name: product.name,
      price: variant?.price ? variant.price.toString() : product.price,
      image: images[0],
      variantId: selectedVariant || undefined,
      variantName: variant?.name,
    })

    setJustAdded(true)
    setTimeout(() => {
      setIsAdding(false)
      setJustAdded(false)
    }, 2000)
  }

  const displayPrice = selectedVariant
    ? product.variants?.find((v) => v.id === selectedVariant)?.price || parseFloat(product.price)
    : parseFloat(product.price)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {isOutOfStock && (
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-full">
                    SOLD OUT
                  </span>
                </div>
              )}
              {product.compareAtPrice &&
                parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">
                      SALE
                    </span>
                  </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-neutral-100 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-black"
                        : "hover:ring-2 ring-neutral-300"
                    }`}
                  >
                    <Image src={image} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold">
                  ${displayPrice.toFixed(2)}
                </span>
                {product.compareAtPrice &&
                  parseFloat(product.compareAtPrice) > displayPrice && (
                    <>
                      <span className="text-2xl text-neutral-500 line-through">
                        ${parseFloat(product.compareAtPrice).toFixed(2)}
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full">
                        {Math.round(
                          ((parseFloat(product.compareAtPrice) - displayPrice) /
                            parseFloat(product.compareAtPrice)) *
                            100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
              </div>
              <p className="text-lg text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Option</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        selectedVariant === variant.id
                          ? "bg-black text-white"
                          : "bg-white border-2 border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      {variant.name}
                      {variant.price && variant.price !== parseFloat(product.price) && (
                        <span className="ml-2 text-sm">
                          (${variant.price.toFixed(2)})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className="w-full h-14 text-lg font-medium gap-2"
            >
              {justAdded ? (
                <>
                  <Check className="h-5 w-5" />
                  Added to Cart!
                </>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>

            {!isOutOfStock && product.stock <= 10 && product.stock > 0 && (
              <p className="text-sm text-orange-600 font-medium">
                Only {product.stock} left in stock!
              </p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-6 border-t">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div className="pt-6 border-t space-y-3">
                  <h3 className="font-bold text-lg">Specifications</h3>
                  <dl className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex gap-4">
                        <dt className="text-neutral-600 font-medium min-w-32">
                          {key}:
                        </dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}


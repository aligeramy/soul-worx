"use client"

import { X, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect } from "react"

interface CartSlideoutProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSlideout({ isOpen, onClose }: CartSlideoutProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Slideout */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-neutral-400" />
              </div>
              <p className="text-lg font-medium text-neutral-600 mb-2">
                Your cart is empty
              </p>
              <p className="text-sm text-neutral-500">
                Add some products to get started
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.variantId || "default"}`}
                  className="flex gap-4 group"
                >
                  <div className="relative w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.name}
                    </h3>
                    {item.variantName && (
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-sm font-bold mt-1">
                      ${parseFloat(item.price).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.variantId
                            )
                          }
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.variantId
                            )
                          }
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id, item.variantId)}
                        className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length > 1 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-neutral-500 hover:text-red-600 transition-colors"
                >
                  Clear cart
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Total</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <Button className="w-full h-12 text-base font-medium">
              Checkout
            </Button>
            <button
              onClick={onClose}
              className="w-full text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}


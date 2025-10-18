"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, DollarSign, Package } from "lucide-react"

interface Product {
  id: string
  slug: string
  name: string
  description: string
  category: string
  status: string
  price: string
  compareAtPrice: string | null
  images: string[]
  stock: number
  sku: string | null
  createdAt: Date
  updatedAt: Date
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true
    return product.status === filter
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      draft: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      sold_out: "bg-red-500/20 text-red-400 border-red-500/30",
      archived: "bg-white/10 text-white/70 border-white/20",
    }
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.draft}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  return (
    <Card className="bg-[#1c1c1e] border-white/10">
      {/* Filters */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-wrap gap-2">
          {["all", "active", "draft", "sold_out", "archived"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {status === "all" ? "All" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image
                              src="/shop/placeholder.webp"
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{product.name}</p>
                        <p className="text-sm text-white/50 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-white font-medium">
                        <DollarSign className="h-3 w-3" />
                        {parseFloat(product.price).toFixed(2)}
                      </div>
                      {product.compareAtPrice &&
                        parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                          <span className="text-sm text-white/50 line-through">
                            ${parseFloat(product.compareAtPrice).toFixed(2)}
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-white/50" />
                      <span
                        className={`font-medium ${
                          product.stock === 0 ? "text-red-400" : "text-white"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white/70">
                      {product.sku || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/shop/${product.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/admin/shop/${product.id}`}>
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-white/70 hover:text-red-400 hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-white/40 mb-4" />
              <p className="text-white/60">No products found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this product?")) return

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Failed to delete product")

    window.location.reload()
  } catch (error) {
    console.error("Error deleting product:", error)
    alert("Failed to delete product")
  }
}

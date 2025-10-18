"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"

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
    const styles = {
      active: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      sold_out: "bg-red-100 text-red-800",
      archived: "bg-neutral-100 text-neutral-800",
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles] || styles.draft
        }`}
      >
        {status.replace("_", " ").toUpperCase()}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl border">
      {/* Filters */}
      <div className="p-6 border-b">
        <div className="flex gap-2">
          {["all", "active", "draft", "sold_out", "archived"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {status === "all" ? "All" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="text-left p-4 font-medium text-sm text-neutral-600">
                Product
              </th>
              <th className="text-left p-4 font-medium text-sm text-neutral-600">
                Status
              </th>
              <th className="text-left p-4 font-medium text-sm text-neutral-600">
                Price
              </th>
              <th className="text-left p-4 font-medium text-sm text-neutral-600">
                Stock
              </th>
              <th className="text-left p-4 font-medium text-sm text-neutral-600">
                SKU
              </th>
              <th className="text-right p-4 font-medium text-sm text-neutral-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-neutral-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <Image
                            src="/shop/placeholder.webp"
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-neutral-500 line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">{getStatusBadge(product.status)}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    {product.compareAtPrice &&
                      parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                        <span className="text-sm text-neutral-500 line-through">
                          ${parseFloat(product.compareAtPrice).toFixed(2)}
                        </span>
                      )}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`font-medium ${
                      product.stock === 0 ? "text-red-600" : ""
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-neutral-600">
                    {product.sku || "—"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/shop/${product.slug}`} target="_blank">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/admin/shop/${product.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
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
          <div className="p-12 text-center text-neutral-500">
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
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


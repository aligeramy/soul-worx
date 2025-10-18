"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface ShopFiltersProps {
  currentCategory?: string
}

export function ShopFilters({ currentCategory }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categories = [
    { label: "All Products", value: "all" },
    { label: "Apparel", value: "apparel" },
    { label: "Accessories", value: "accessories" },
    { label: "Books", value: "books" },
    { label: "Digital", value: "digital" },
  ]

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === "all") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/shop?${params.toString()}`)
  }

  const activeCategory = currentCategory || "all"

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeCategory === category.value
                ? "bg-black text-white shadow-lg"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}


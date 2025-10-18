"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Loader2, X } from "lucide-react"

interface ProductFormProps {
  product?: {
    id: string
    name: string
    slug: string
    description: string
    category: string
    status: string
    price: string
    compareAtPrice: string | null
    images: string[]
    stock: number
    sku: string | null
    trackInventory: boolean
    tags: string[]
    specifications: Record<string, string>
  }
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [imageInput, setImageInput] = useState("")
  const [tags, setTags] = useState<string[]>(product?.tags || [])
  const [tagInput, setTagInput] = useState("")

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    category: product?.category || "other",
    status: product?.status || "draft",
    price: product?.price || "",
    compareAtPrice: product?.compareAtPrice || "",
    stock: product?.stock || 0,
    sku: product?.sku || "",
    trackInventory: product?.trackInventory !== false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = product
        ? `/api/products/${product.id}`
        : "/api/products"
      
      const response = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          tags,
        }),
      })

      if (!response.ok) throw new Error("Failed to save product")

      router.push("/dashboard/admin/shop")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setFormData((prev) => ({ ...prev, slug }))
  }

  const addImage = () => {
    if (imageInput.trim()) {
      setImages((prev) => [...prev, imageInput.trim()])
      setImageInput("")
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-8 space-y-8">
      {/* Basic Info */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Basic Information</h2>
        
        <Field label="Product Name" htmlFor="name" required>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="E.g., SoulWorx T-Shirt"
            required
          />
        </Field>

        <Field label="Slug" htmlFor="slug" required>
          <div className="flex gap-2">
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="product-slug"
              required
            />
            <Button type="button" variant="outline" onClick={generateSlug}>
              Generate
            </Button>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            URL: /shop/{formData.slug || "product-slug"}
          </p>
        </Field>

        <Field label="Description" htmlFor="description" required>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product..."
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category" htmlFor="category" required>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="apparel">Apparel</option>
              <option value="accessories">Accessories</option>
              <option value="books">Books</option>
              <option value="digital">Digital</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Status" htmlFor="status" required>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="sold_out">Sold Out</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Pricing & Inventory</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price" htmlFor="price" required>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="29.99"
              required
            />
          </Field>

          <Field label="Compare at Price" htmlFor="compareAtPrice">
            <Input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              step="0.01"
              value={formData.compareAtPrice}
              onChange={handleChange}
              placeholder="39.99"
            />
            <p className="text-sm text-neutral-500 mt-1">
              Original price for showing discounts
            </p>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Stock" htmlFor="stock">
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
            />
          </Field>

          <Field label="SKU" htmlFor="sku">
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SW-TSH-001"
            />
          </Field>
        </div>

        <Field label="" htmlFor="trackInventory">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              id="trackInventory"
              name="trackInventory"
              checked={formData.trackInventory}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm">Track inventory</span>
          </label>
        </Field>
      </div>

      {/* Images */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Images</h2>
        
        <div className="flex gap-2">
          <Input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="/shop/placeholder.webp or image URL"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
          />
          <Button type="button" onClick={addImage}>
            Add Image
          </Button>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                <Image src={image} alt="" width={200} height={200} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Tags</h2>
        
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag}>
            Add Tag
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-neutral-100 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            product ? "Update Product" : "Create Product"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}


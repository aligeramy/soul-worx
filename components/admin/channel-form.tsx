"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Channel {
  id?: string
  slug?: string
  title?: string
  description?: string
  longDescription?: string | null
  category?: string
  status?: string
  coverImage?: string | null
  thumbnailImage?: string | null
  requiredTierLevel?: number
  isFeatured?: boolean
  tags?: string[] | null
  metaTitle?: string | null
  metaDescription?: string | null
  sortOrder?: number
}

interface ChannelFormProps {
  channel?: Channel
  onSuccess?: () => void
}

export function ChannelForm({ channel, onSuccess }: ChannelFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: channel?.slug || "",
    title: channel?.title || "",
    description: channel?.description || "",
    longDescription: channel?.longDescription || "",
    category: channel?.category || "basketball",
    status: channel?.status || "draft",
    coverImage: channel?.coverImage || "",
    thumbnailImage: channel?.thumbnailImage || "",
    requiredTierLevel: channel?.requiredTierLevel || 1,
    isFeatured: channel?.isFeatured || false,
    tags: channel?.tags?.join(", ") || "",
    metaTitle: channel?.metaTitle || "",
    metaDescription: channel?.metaDescription || "",
    sortOrder: channel?.sortOrder || 0,
    createDiscordChannel: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = channel
        ? `/api/community/channels/${channel.id}`
        : "/api/community/channels"
      
      const method = channel ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          requiredTierLevel: Number(formData.requiredTierLevel),
          sortOrder: Number(formData.sortOrder),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save channel")
      }

      toast.success(channel ? "Channel updated!" : "Channel created!")
      onSuccess?.()
      router.refresh()
    } catch (error: unknown) {
      console.error("Error saving channel:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save channel"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <Label htmlFor="title">Channel Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </Field>

        <Field>
          <Label htmlFor="slug">Slug (URL-friendly)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData({
                ...formData,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
            required
          />
        </Field>

        <Field>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="career">Career Development</SelectItem>
              <SelectItem value="scholarships">Athletic Scholarships</SelectItem>
              <SelectItem value="life_skills">Life Skills</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <Label htmlFor="requiredTierLevel">Required Tier Level</Label>
          <Select
            value={String(formData.requiredTierLevel)}
            onValueChange={(value) =>
              setFormData({ ...formData, requiredTierLevel: Number(value) })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Tier 1 (Free/Basic)</SelectItem>
              <SelectItem value="2">Tier 2 (Premium)</SelectItem>
              <SelectItem value="3">Tier 3 (VIP)</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) =>
              setFormData({ ...formData, sortOrder: Number(e.target.value) })
            }
          />
        </Field>
      </div>

      <Field>
        <Label htmlFor="description">Short Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </Field>

      <Field>
        <Label htmlFor="longDescription">Long Description</Label>
        <textarea
          id="longDescription"
          value={formData.longDescription}
          onChange={(e) =>
            setFormData({ ...formData, longDescription: e.target.value })
          }
          className="w-full min-h-[120px] rounded-md border border-neutral-300 px-3 py-2"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            type="url"
            value={formData.coverImage}
            onChange={(e) =>
              setFormData({ ...formData, coverImage: e.target.value })
            }
          />
        </Field>

        <Field>
          <Label htmlFor="thumbnailImage">Thumbnail Image URL</Label>
          <Input
            id="thumbnailImage"
            type="url"
            value={formData.thumbnailImage}
            onChange={(e) =>
              setFormData({ ...formData, thumbnailImage: e.target.value })
            }
          />
        </Field>
      </div>

      <Field>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="basketball, youth, training"
        />
      </Field>

      <Field>
        <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
        <Input
          id="metaTitle"
          value={formData.metaTitle}
          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
        />
      </Field>

      <Field>
        <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
        <Input
          id="metaDescription"
          value={formData.metaDescription}
          onChange={(e) =>
            setFormData({ ...formData, metaDescription: e.target.value })
          }
        />
      </Field>

      {!channel && (
        <Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.createDiscordChannel}
              onChange={(e) =>
                setFormData({ ...formData, createDiscordChannel: e.target.checked })
              }
            />
            <span>Create Discord channel</span>
          </label>
        </Field>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : channel ? "Update Channel" : "Create Channel"}
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


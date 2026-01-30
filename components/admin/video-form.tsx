"use client"

import { useState, useEffect } from "react"
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

interface Video {
  id?: string
  channelId?: string
  slug?: string
  title?: string
  description?: string | null
  videoUrl?: string
  thumbnailUrl?: string | null
  duration?: string | number | null
  isFirstEpisode?: boolean
  episodeNumber?: string | number | null
  seasonNumber?: number | null
  requiredTierLevel?: number
  status?: string
  tags?: string[] | null
  metaTitle?: string | null
  metaDescription?: string | null
}

interface Channel {
  id: string
  title: string
}

interface VideoFormProps {
  video?: Video
  channelId?: string
  onSuccess?: () => void
}

export function VideoForm({ video, channelId, onSuccess }: VideoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [channels, setChannels] = useState<Channel[]>([])
  const [formData, setFormData] = useState({
    channelId: video?.channelId || channelId || "",
    slug: video?.slug || "",
    title: video?.title || "",
    description: video?.description || "",
    videoUrl: video?.videoUrl || "",
    thumbnailUrl: video?.thumbnailUrl || "",
    duration: video?.duration || "",
    isFirstEpisode: video?.isFirstEpisode || false,
    episodeNumber: video?.episodeNumber || "",
    seasonNumber: video?.seasonNumber || 1,
    requiredTierLevel: video?.requiredTierLevel || 2,
    status: video?.status || "draft",
    tags: video?.tags?.join(", ") || "",
    metaTitle: video?.metaTitle || "",
    metaDescription: video?.metaDescription || "",
  })

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      const response = await fetch("/api/community/channels?all=true")
      if (response.ok) {
        const data = await response.json()
        setChannels(data)
      }
    } catch (error) {
      console.error("Error fetching channels:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = video
        ? `/api/community/videos/${video.id}`
        : "/api/community/videos"
      
      const method = video ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          duration: formData.duration ? Number(formData.duration) : null,
          episodeNumber: formData.episodeNumber ? Number(formData.episodeNumber) : null,
          seasonNumber: Number(formData.seasonNumber),
          requiredTierLevel: Number(formData.requiredTierLevel),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save video")
      }

      toast.success(video ? "Video updated!" : "Video created!")
      onSuccess?.()
      router.refresh()
    } catch (error: unknown) {
      console.error("Error saving video:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save video"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <Label htmlFor="channelId">Channel</Label>
          <Select
            value={formData.channelId}
            onValueChange={(value) => setFormData({ ...formData, channelId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.title}
                </SelectItem>
              ))}
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
              <SelectItem value="unlisted">Unlisted</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <Label htmlFor="title">Video Title</Label>
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
          <Label htmlFor="episodeNumber">Episode Number</Label>
          <Input
            id="episodeNumber"
            type="number"
            value={formData.episodeNumber}
            onChange={(e) =>
              setFormData({ ...formData, episodeNumber: e.target.value })
            }
          />
        </Field>

        <Field>
          <Label htmlFor="seasonNumber">Season Number</Label>
          <Input
            id="seasonNumber"
            type="number"
            value={formData.seasonNumber}
            onChange={(e) =>
              setFormData({ ...formData, seasonNumber: Number(e.target.value) })
            }
          />
        </Field>

        <Field>
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
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
              <SelectItem value="1">Tier 1 (Free)</SelectItem>
              <SelectItem value="2">Tier 2 (Pro)</SelectItem>
              <SelectItem value="3">Tier 3 (VIP)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo, or direct link)</Label>
        <Input
          id="videoUrl"
          type="url"
          value={formData.videoUrl}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          required
        />
      </Field>

      <Field>
        <Label htmlFor="description">Description</Label>
        <div className="space-y-2">
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter a detailed description of the video content, what viewers will learn, key topics covered, and any important information..."
            className="w-full min-h-[200px] rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm resize-y shadow-sm transition-all outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 focus:shadow-md"
            rows={8}
          />
          <div className="text-xs text-neutral-500 flex justify-between">
            <span>Provide a comprehensive description to help viewers understand the video content</span>
            <span>{formData.description.length} characters</span>
          </div>
        </div>
      </Field>

      <Field>
        <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
        <Input
          id="thumbnailUrl"
          type="url"
          value={formData.thumbnailUrl}
          onChange={(e) =>
            setFormData({ ...formData, thumbnailUrl: e.target.value })
          }
        />
      </Field>

      <Field>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isFirstEpisode}
            onChange={(e) =>
              setFormData({ ...formData, isFirstEpisode: e.target.checked })
            }
          />
          <span>This is the first episode (free for all tiers)</span>
        </label>
      </Field>

      <Field>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="basketball, tutorial, beginner"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) =>
              setFormData({ ...formData, metaTitle: e.target.value })
            }
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
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : video ? "Update Video" : "Create Video"}
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


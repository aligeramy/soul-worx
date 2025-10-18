"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Loader2, X } from "lucide-react"

interface StoryFormProps {
  story?: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    coverImage: string | null
    category: string
    tags: string[]
    status: string
    metaTitle: string | null
    metaDescription: string | null
    ogImage: string | null
  }
}

export function StoryForm({ story }: StoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>(story?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [coverImage, setCoverImage] = useState(story?.coverImage || "")
  const [ogImage, setOgImage] = useState(story?.ogImage || "")

  const [formData, setFormData] = useState({
    title: story?.title || "",
    slug: story?.slug || "",
    excerpt: story?.excerpt || "",
    content: story?.content || "",
    category: story?.category || "stories",
    status: story?.status || "draft",
    metaTitle: story?.metaTitle || "",
    metaDescription: story?.metaDescription || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = story
        ? `/api/stories/${story.id}`
        : "/api/stories"
      
      const response = await fetch(url, {
        method: story ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          coverImage: coverImage || null,
          ogImage: ogImage || null,
          tags,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save story")
      }

      router.push("/dashboard/admin/stories")
      router.refresh()
    } catch (error) {
      console.error("Error saving story:", error)
      alert(error instanceof Error ? error.message : "Failed to save story")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setFormData((prev) => ({ ...prev, slug }))
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
        
        <Field label="Title" htmlFor="title" required>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="E.g., Summer Poetry Workshop Recap"
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
              placeholder="story-slug"
              required
            />
            <Button type="button" variant="outline" onClick={generateSlug}>
              Generate
            </Button>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            URL: /stories/{formData.category}/{formData.slug || "story-slug"}
          </p>
        </Field>

        <Field label="Excerpt" htmlFor="excerpt">
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Short summary of the story (optional)..."
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-sm text-neutral-500 mt-1">
            Brief description for cards and previews
          </p>
        </Field>

        <Field label="Content" htmlFor="content" required>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your story content here (supports markdown)..."
            rows={12}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
            required
          />
          <p className="text-sm text-neutral-500 mt-1">
            Supports Markdown formatting
          </p>
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
              <option value="poetry">Poetry Drop</option>
              <option value="stories">Community Highlight</option>
              <option value="news">Event Recap</option>
              <option value="announcements">Press & Media</option>
              <option value="tutorials">Tutorial</option>
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
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Images</h2>
        
        <Field label="Cover Image" htmlFor="coverImage">
          <Input
            id="coverImage"
            name="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="/optimized/0K0A0687.jpg or image URL"
          />
          {coverImage && (
            <div className="mt-3 relative group aspect-video bg-neutral-100 rounded-lg overflow-hidden">
              <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <p className="text-sm text-neutral-500 mt-1">
            Main image shown in story listings and at the top of the story
          </p>
        </Field>

        <Field label="Social Share Image (OG Image)" htmlFor="ogImage">
          <Input
            id="ogImage"
            name="ogImage"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="/optimized/0K0A0687.jpg or image URL"
          />
          {ogImage && (
            <div className="mt-3 relative group aspect-video bg-neutral-100 rounded-lg overflow-hidden max-w-md">
              <img src={ogImage} alt="OG preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setOgImage("")}
                className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <p className="text-sm text-neutral-500 mt-1">
            Image shown when shared on social media (defaults to cover image)
          </p>
        </Field>
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

      {/* SEO */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">SEO (Optional)</h2>
        
        <Field label="Meta Title" htmlFor="metaTitle">
          <Input
            id="metaTitle"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder="Leave blank to use story title"
          />
        </Field>

        <Field label="Meta Description" htmlFor="metaDescription">
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="SEO description (leave blank to use excerpt)"
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </Field>
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
            story ? "Update Story" : "Create Story"
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


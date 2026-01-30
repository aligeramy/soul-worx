"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, X } from "lucide-react"

interface ProgramFormProps {
  program?: {
    id: string
    title: string
    slug: string
    description: string
    longDescription: string | null
    category: string
    status: string
    coverImage: string | null
    images: string[]
    videoUrl: string | null
    duration: string | null
    ageRange: string | null
    capacity: number | null
    price: string | null
    registrationRequired: boolean
    requiresParentConsent: boolean
    tags: string[]
    faqs: { question: string; answer: string }[]
    requirements?: { id: string; text: string; checked: boolean }[]
    metaTitle: string | null
    metaDescription: string | null
  }
}

export function ProgramForm({ program }: ProgramFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(program?.images || [])
  const [imageInput, setImageInput] = useState("")
  const [coverImage, setCoverImage] = useState(program?.coverImage || "")
  const [tags, setTags] = useState<string[]>(program?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    program?.faqs || []
  )
  const [requirements, setRequirements] = useState<{ id: string; text: string; checked: boolean }[]>(
    (program?.requirements as { id: string; text: string; checked: boolean }[] | undefined) || []
  )
  const [requirementInput, setRequirementInput] = useState("")

  const [formData, setFormData] = useState({
    title: program?.title || "",
    slug: program?.slug || "",
    description: program?.description || "",
    longDescription: program?.longDescription || "",
    category: program?.category || "community",
    status: program?.status || "draft",
    videoUrl: program?.videoUrl || "",
    duration: program?.duration || "",
    ageRange: program?.ageRange || "",
    capacity: program?.capacity || "",
    price: program?.price || "0",
    registrationRequired: program?.registrationRequired !== false,
    requiresParentConsent: program?.requiresParentConsent || false,
    metaTitle: program?.metaTitle || "",
    metaDescription: program?.metaDescription || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = program
        ? `/api/programs/${program.id}`
        : "/api/programs"
      
      const response = await fetch(url, {
        method: program ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          coverImage: coverImage || null,
          images,
          tags,
          faqs,
          requirements,
          capacity: formData.capacity ? parseInt(formData.capacity as string) : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save program")
      }

      router.push("/dashboard/admin/programs")
      router.refresh()
    } catch (error) {
      console.error("Error saving program:", error)
      alert(error instanceof Error ? error.message : "Failed to save program")
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
    const slug = formData.title
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

  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }])
  }

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    setFaqs((prev) => {
      const updated = [...prev]
      updated[index][field] = value
      return updated
    })
  }

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index))
  }

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setRequirements((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text: requirementInput.trim(), checked: false },
      ])
      setRequirementInput("")
    }
  }

  const toggleRequirement = (id: string, checked?: boolean) => {
    setRequirements((prev) =>
      prev.map((req) => 
        req.id === id 
          ? { ...req, checked: checked !== undefined ? checked : !req.checked } 
          : req
      )
    )
  }

  const removeRequirement = (id: string) => {
    setRequirements((prev) => prev.filter((req) => req.id !== id))
  }

  const updateRequirementText = (id: string, text: string) => {
    setRequirements((prev) =>
      prev.map((req) => (req.id === id ? { ...req, text } : req))
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-8 space-y-8">
      {/* Basic Info */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Basic Information</h2>
        
        <Field label="Program Title" htmlFor="title" required>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="E.g., Youth Poetry Workshop"
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
              placeholder="program-slug"
              required
            />
            <Button type="button" variant="outline" onClick={generateSlug}>
              Generate
            </Button>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            URL: /programs/{formData.slug || "program-slug"}
          </p>
        </Field>

        <Field label="Short Description" htmlFor="description" required>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief overview of the program (shown in listings)..."
            rows={3}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white shadow-sm transition-all outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 focus:shadow-md"
            required
          />
        </Field>

        <Field label="Full Description" htmlFor="longDescription">
          <textarea
            id="longDescription"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            placeholder="Detailed description with all program details (supports markdown)..."
            rows={8}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white shadow-sm transition-all outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 focus:shadow-md font-mono text-sm"
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
              <option value="youth">Youth</option>
              <option value="schools">Partnerships</option>
              <option value="community">Community</option>
              <option value="workshops">Workshops</option>
              <option value="special">Special Events</option>
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

      {/* Program Details */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Program Details</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Field label="Duration" htmlFor="duration">
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="E.g., 6 weeks, 3 months"
            />
          </Field>

          <Field label="Age Range" htmlFor="ageRange">
            <Input
              id="ageRange"
              name="ageRange"
              value={formData.ageRange}
              onChange={handleChange}
              placeholder="E.g., 13-18, All ages"
            />
          </Field>

          <Field label="Capacity" htmlFor="capacity">
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Max participants"
            />
          </Field>

          <Field label="Price ($)" htmlFor="price">
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00 for free"
            />
          </Field>
        </div>

        <div className="space-y-3">
          <Field label="" htmlFor="registrationRequired">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="registrationRequired"
                name="registrationRequired"
                checked={formData.registrationRequired}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Registration required</span>
            </label>
          </Field>

          <Field label="" htmlFor="requiresParentConsent">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requiresParentConsent"
                name="requiresParentConsent"
                checked={formData.requiresParentConsent}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Requires parental consent</span>
            </label>
          </Field>
        </div>
      </div>

      {/* Media */}
      <div className="space-y-6 pt-6 border-t">
        <h2 className="text-xl font-bold">Media</h2>
        
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
              <Image src={coverImage} alt="Cover preview" width={400} height={225} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </Field>

        <Field label="Additional Images" htmlFor="images">
          <div className="flex gap-2">
            <Input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="/optimized/0K0A0687.jpg or image URL"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            />
            <Button type="button" onClick={addImage}>
              Add
            </Button>
          </div>
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-4">
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
        </Field>

        <Field label="Video URL" htmlFor="videoUrl">
          <Input
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
          />
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
            Add
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

      {/* Requirements */}
      <div className="space-y-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Program Requirements</h2>
          <Button type="button" onClick={addRequirement} variant="outline">
            Add Requirement
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={requirementInput}
            onChange={(e) => setRequirementInput(e.target.value)}
            placeholder="Add a requirement..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
          />
          <Button type="button" onClick={addRequirement}>
            Add
          </Button>
        </div>

        {requirements.length > 0 && (
          <div className="space-y-2">
            {requirements.map((requirement) => (
              <div
                key={requirement.id}
                className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <Checkbox
                  checked={requirement.checked}
                  onCheckedChange={(checked) => toggleRequirement(requirement.id, checked as boolean)}
                  id={`req-${requirement.id}`}
                />
                <Input
                  value={requirement.text}
                  onChange={(e) => updateRequirementText(requirement.id, e.target.value)}
                  placeholder="Requirement text..."
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(requirement.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  aria-label="Remove requirement"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQs */}
      <div className="space-y-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">FAQs</h2>
          <Button type="button" onClick={addFaq} variant="outline">
            Add FAQ
          </Button>
        </div>
        
        {faqs.map((faq, index) => (
          <div key={index} className="p-4 bg-neutral-50 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-neutral-600">FAQ {index + 1}</span>
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Input
              value={faq.question}
              onChange={(e) => updateFaq(index, "question", e.target.value)}
              placeholder="Question..."
            />
            <textarea
              value={faq.answer}
              onChange={(e) => updateFaq(index, "answer", e.target.value)}
              placeholder="Answer..."
              rows={2}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white shadow-sm transition-all outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 focus:shadow-md"
            />
          </div>
        ))}
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
            placeholder="Leave blank to use program title"
          />
        </Field>

        <Field label="Meta Description" htmlFor="metaDescription">
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="SEO description (leave blank to use program description)"
            rows={2}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white shadow-sm transition-all outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 focus:shadow-md"
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
            program ? "Update Program" : "Create Program"
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


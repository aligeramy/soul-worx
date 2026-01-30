"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VideoGrid } from "./VideoGrid"

interface Section {
  id: string
  slug: string
  title: string
  description?: string | null
  videos: Array<{ id: string; title: string; thumbnailUrl: string | null; videoUrl: string; sectionId: string | null }>
}

interface SectionSelectorProps {
  sections: Section[]
  allVideos: Array<{ id: string; title: string; thumbnailUrl: string | null; videoUrl: string; sectionId: string | null }>
  slug: string
}

export function SectionSelector({ sections, allVideos, slug }: SectionSelectorProps) {
  const [selectedSection, setSelectedSection] = useState<string>("all")

  const currentSection = selectedSection === "all" 
    ? null 
    : sections.find(s => s.slug === selectedSection)

  const currentVideos = selectedSection === "all" 
    ? allVideos 
    : currentSection?.videos || []

  const currentTitle = selectedSection === "all"
    ? "All Episodes"
    : currentSection?.title || "Episodes"

  const currentDescription = currentSection?.description

  return (
    <div className="w-full">
      <div className="mb-6">
        <Select value={selectedSection} onValueChange={setSelectedSection}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All Episodes ({allVideos.length})
            </SelectItem>
            {sections.map((section) => (
              <SelectItem key={section.id} value={section.slug}>
                {section.title} ({section.videos.length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">{currentTitle}</h2>
        {currentDescription && (
          <p className="text-neutral-600 mb-6">{currentDescription}</p>
        )}
        <VideoGrid videos={currentVideos} slug={slug} />
      </div>
    </div>
  )
}


"use client"

import { useRouter } from "next/navigation"

interface DeleteStoryButtonProps {
  storyId: string
  storyTitle: string
}

export function DeleteStoryButton({ storyId, storyTitle }: DeleteStoryButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${storyTitle}"?`)) {
      try {
        const response = await fetch(`/api/stories/${storyId}`, { 
          method: "DELETE" 
        })
        
        if (response.ok) {
          router.refresh()
        } else {
          alert("Failed to delete story")
        }
      } catch (error) {
        console.error("Error deleting story:", error)
        alert("Failed to delete story")
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      className="h-6 w-6 p-0 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}


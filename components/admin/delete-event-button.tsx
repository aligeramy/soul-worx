"use client"

import { useRouter } from "next/navigation"

interface DeleteEventButtonProps {
  eventId: string
  eventTitle: string
}

export function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      try {
        const response = await fetch(`/api/events/${eventId}`, { 
          method: "DELETE" 
        })
        
        if (response.ok) {
          router.refresh()
        } else {
          alert("Failed to delete event")
        }
      } catch (error) {
        console.error("Error deleting event:", error)
        alert("Failed to delete event")
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}


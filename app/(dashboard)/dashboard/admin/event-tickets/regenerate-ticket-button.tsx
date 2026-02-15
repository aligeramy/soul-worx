"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function RegenerateTicketButton({ ticketId }: { ticketId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/event-tickets/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to regenerate")
        return
      }
      if (data.errors?.length) {
        alert(data.errors.join("\n"))
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-white/20 text-white/80 hover:bg-white/10"
      onClick={handleClick}
      disabled={loading}
    >
      <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Generating…" : "Regenerate"}
    </Button>
  )
}

export function RegenerateAllForEventButton({ eventId, count }: { eventId: string; count: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/event-tickets/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to regenerate")
        return
      }
      if (data.errors?.length) {
        alert(`Regenerated ${data.regenerated}. Errors:\n${data.errors.join("\n")}`)
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (count === 0) return null

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-white/20 text-white/80 hover:bg-white/10"
      onClick={handleClick}
      disabled={loading}
    >
      <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Generating…" : `Regenerate ${count} missing`}
    </Button>
  )
}

"use client"

import { useRouter } from "next/navigation"

export function TicketRow({
  ticketId,
  children,
}: {
  ticketId: string
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <tr
      onClick={() => router.push(`/dashboard/admin/event-tickets/${ticketId}`)}
      className="cursor-pointer hover:bg-white/5 transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          router.push(`/dashboard/admin/event-tickets/${ticketId}`)
        }
      }}
    >
      {children}
    </tr>
  )
}

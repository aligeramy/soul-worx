"use client"

export function StopPropagation({ children }: { children: React.ReactNode }) {
  return <span onClick={(e) => e.stopPropagation()} className="inline-block">{children}</span>
}

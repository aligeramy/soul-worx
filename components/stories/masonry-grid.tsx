import { ReactNode } from "react"

interface MasonryGridProps {
  children: ReactNode
}

export function MasonryGrid({ children }: MasonryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  )
}


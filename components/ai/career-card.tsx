"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface CareerCardProps {
  title: string
  description: string
  category?: string
  href?: string
}

export function CareerCard({ title, description, category, href }: CareerCardProps) {
  const content = (
    <Card className="group hover:bg-white/10 transition-colors border-white/20 bg-white/5">
      <CardHeader className="pb-3">
        {category && (
          <div className="inline-block">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
              {category}
            </span>
          </div>
        )}
        <CardTitle className="text-white text-lg leading-tight group-hover:text-purple-300 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="mt-4 flex items-center text-purple-300 text-sm font-medium">
          <span>Learn more</span>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}

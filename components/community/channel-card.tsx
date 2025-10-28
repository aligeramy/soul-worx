"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lock, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChannelCardProps {
  id: string
  slug: string
  title: string
  description: string
  coverImage: string | null
  videoCount: number
  requiredTierLevel: number
  userTierLevel: number
}

export function ChannelCard({
  slug,
  title,
  description,
  coverImage,
  videoCount,
  requiredTierLevel,
  userTierLevel,
}: ChannelCardProps) {
  const hasFullAccess = userTierLevel >= requiredTierLevel
  const isLocked = !hasFullAccess

  return (
    <Link href={`/programs/community/${slug}`} className="block group">
      <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-0 border-0 gap-0">
        <div className="relative aspect-[4/5] overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
          )}
          
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Top badges */}
            <div className="flex items-start justify-between">
              {isLocked && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                  <Lock className="w-3 h-3" />
                  <span>Tier {requiredTierLevel}+</span>
                </div>
              )}
              
              {hasFullAccess && (
                <div className="px-3 py-1.5 bg-green-500/60 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                  Full Access
                </div>
              )}
            </div>

          {/* Bottom content */}
          <div className="space-y-3">
            <div>
              <h3 className="text-2xl font-crimson font-normal text-white mb-2 line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-white/80 line-clamp-2">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <PlayCircle className="w-4 h-4" />
                <span>{videoCount} {videoCount === 1 ? 'program' : 'programs'}</span>
              </div>
              
              {!hasFullAccess && (
                <span className="text-xs text-green-400 font-medium">
                  First program free
                </span>
              )}
            </div>

            <Button 
              className={cn(
                "w-full",
                hasFullAccess 
                  ? "bg-white text-black hover:bg-white/90" 
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/30"
              )}
              variant={hasFullAccess ? "default" : "outline"}
            >
              {hasFullAccess ? "Watch All Programs" : "View First Episode"}
            </Button>
          </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}


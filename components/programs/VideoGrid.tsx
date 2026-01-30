import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

type Video = {
  id: string
  title: string
  thumbnailUrl: string | null
  videoUrl: string
  slug?: string
  duration?: number | null
  hasAccess?: boolean
  isFirstEpisode?: boolean
  episodeNumber?: number | null
  seasonNumber?: number | null
  requiredTierLevel?: number
  section?: { title: string } | null
  channel?: { slug: string } | null
}

export function VideoGrid({ videos, slug }: { videos: Video[], slug: string }) {
  return (
    <Suspense fallback={<div>Loading videos...</div>}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video) => {
              const VideoCard = (
                <Card 
                  className={`group overflow-hidden transition-all duration-300 h-full flex flex-col relative p-0 border-0 shadow-sm hover:shadow-xl ${
                    video.hasAccess 
                      ? "cursor-pointer hover:-translate-y-1" 
                      : "opacity-90"
                  }`}
                >
                  <div className="relative w-full aspect-video bg-neutral-100">
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className={`object-cover transition-transform duration-300 ${
                          !video.hasAccess ? "grayscale group-hover:grayscale-0" : "group-hover:scale-105"
                        }`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center ${
                        !video.hasAccess ? "grayscale opacity-50" : ""
                      }`}>
                        <svg
                          className="w-12 h-12 text-white/80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Duration badge */}
                    {(video.duration ?? 0) > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-md">
                        {Math.floor(Number(video.duration) / 60)}:{String(Number(video.duration) % 60).padStart(2, "0")}
                      </div>
                    )}

                    {/* Free episode badge */}
                    {video.isFirstEpisode && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-lg">
                        FREE
                      </div>
                    )}

                    {/* Section badge */}
                    {video.section && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-[10px] font-medium bg-white/95 backdrop-blur-sm text-neutral-900 border-0 shadow-sm">
                          {video.section.title}
                        </Badge>
                      </div>
                    )}

                    {/* Lock overlay for locked videos */}
                    {!video.hasAccess && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                        <div className="flex flex-col items-center gap-2 text-white">
                          <div className="p-3 bg-black/40 rounded-full backdrop-blur-sm">
                            <Lock className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-medium">
                            Tier {video.requiredTierLevel}+
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="space-y-0">
                      {video.episodeNumber && (
                        <p className="text-[10px] leading-none font-medium text-neutral-500 uppercase tracking-wider mb-1 -mt-4">
                          Episode {video.episodeNumber}
                          {video.seasonNumber && video.seasonNumber > 1 && ` • S${video.seasonNumber}`}
                        </p>
                      )}
                      <p className="font-semibold leading-none text-sm line-clamp-2 text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
                        {video.title}
                      </p>
                    </div>
                  </div>

                  {/* Hover upgrade button */}
                  {!video.hasAccess && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                      <Link href="/programs/community#membership-tiers" className="pointer-events-auto">
                        <Button size="sm" className="shadow-xl bg-white text-neutral-900 hover:bg-neutral-100 font-semibold">
                          Upgrade to Access
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              )

              if (video.hasAccess && video.slug) {
                const channelSlug = video.channel?.slug || slug
                return (
                  <Link key={video.id} href={`/programs/community/${channelSlug}/${video.slug}`}>
                    {VideoCard}
                  </Link>
                )
              }

              return <div key={video.id}>{VideoCard}</div>
            })}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600 mb-4">
            No episodes available yet
          </p>
        </div>
      )}
    </Suspense>
  )
}


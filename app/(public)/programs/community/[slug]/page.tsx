import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { communityChannels, videos, userMemberships } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

async function getUserMembership(userId: string | undefined) {
  if (!userId) return null
  
  return await db.query.userMemberships.findFirst({
    where: and(
      eq(userMemberships.userId, userId),
      eq(userMemberships.status, "active")
    ),
    with: {
      tier: true,
    },
  })
}

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()
  
  const [channel, membership] = await Promise.all([
    db.query.communityChannels.findFirst({
      where: and(
        eq(communityChannels.slug, slug),
        eq(communityChannels.status, "published")
      ),
      with: {
        videos: {
          where: eq(videos.status, "published"),
          orderBy: [desc(videos.seasonNumber), desc(videos.episodeNumber)],
        },
      },
    }),
    getUserMembership(session?.user?.id),
  ])

  if (!channel) {
    redirect("/programs/community")
  }

  const userTierLevel = membership?.tier?.accessLevel || 0
  const hasChannelAccess = userTierLevel >= channel.requiredTierLevel

  // Filter videos based on user's tier
  const accessibleVideos = channel.videos.filter((video) => {
    if (video.isFirstEpisode) return true // First episodes are always free
    return userTierLevel >= video.requiredTierLevel
  })

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Channel Header with Cover Image */}
      <section className="relative h-[50vh] overflow-hidden">
        {channel.coverImage ? (
          <Image
            src={channel.coverImage}
            alt={channel.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/programs/community"
              className="text-white/80 hover:text-white mb-4 inline-block"
            >
              ← Back to Community
            </Link>
            
            <div className="mt-6">
              <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
                {channel.title}
              </h1>
              {channel.longDescription ? (
                <div 
                  className="text-sm text-white/90 mb-6 max-w-3xl prose prose-invert prose-lg prose-headings:text-white prose-p:text-white/90 prose-li:text-white/90"
                  dangerouslySetInnerHTML={{ __html: channel.longDescription }}
                />
              ) : (
                <p className="text-md text-white/90 mb-6 max-w-3xl">
                  {channel.description}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-sm">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black font-bold rounded-full uppercase tracking-wide">
                  {channel.videoCount} videos
                </span>
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black font-bold rounded-full uppercase tracking-wide">
                  {channel.category.replace('_', ' ')}
                </span>
                {!hasChannelAccess && (
                  <span className="px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-full font-bold">
                    Requires Tier {channel.requiredTierLevel}+
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hasChannelAccess && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <p className="text-yellow-900 font-medium mb-2">
              Limited Access
            </p>
            <p className="text-yellow-800 mb-4">
              You can watch the first episode for free. Upgrade your membership to
              access all videos in this channel.
            </p>
            <Link href="/programs/community#membership-tiers">
              <Button>View Membership Tiers</Button>
            </Link>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Videos</h2>
        
        <Suspense fallback={<div>Loading videos...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessibleVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/programs/community/${slug}/${video.slug}`}>
                  <div className="relative">
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-white"
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
                    
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
                      </div>
                    )}

                    {video.isFirstEpisode && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                        FREE
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    
                    {video.episodeNumber && (
                      <p className="text-sm text-neutral-600 mb-2">
                        Episode {video.episodeNumber}
                        {video.seasonNumber && video.seasonNumber > 1 && ` • Season ${video.seasonNumber}`}
                      </p>
                    )}
                    
                    {video.description && (
                      <p className="text-sm text-neutral-600 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </Suspense>

        {accessibleVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">
              No videos available with your current membership
            </p>
            <Link href="/programs/community#membership-tiers">
              <Button>Upgrade Membership</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}


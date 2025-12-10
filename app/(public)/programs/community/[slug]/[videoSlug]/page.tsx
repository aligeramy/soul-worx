import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { communityChannels, videos, userMemberships } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { VideoViewTracker } from "@/components/video-view-tracker"
import { SessionProvider } from "@/components/providers/session-provider"

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

function getVideoEmbedUrl(url: string): string {
  // Convert YouTube watch URLs to embed
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v")
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  // Convert YouTube short URLs
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  // Convert Vimeo URLs
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1].split("?")[0]
    return `https://player.vimeo.com/video/${videoId}`
  }
  
  return url
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ slug: string; videoSlug: string }>
}) {
  const { slug, videoSlug } = await params
  const session = await auth()
  
  const [channel, video, membership] = await Promise.all([
    db.query.communityChannels.findFirst({
      where: and(
        eq(communityChannels.slug, slug),
        eq(communityChannels.status, "published")
      ),
    }),
    db.query.videos.findFirst({
      where: and(
        eq(videos.slug, videoSlug),
        eq(videos.status, "published")
      ),
      with: {
        channel: true,
      },
    }),
    getUserMembership(session?.user?.id),
  ])

  if (!channel || !video || video.channel.id !== channel.id) {
    redirect("/programs/community")
  }

  const userTierLevel = membership?.tier?.accessLevel || 0
  const hasAccess = video.isFirstEpisode || userTierLevel >= video.requiredTierLevel

  if (!hasAccess) {
    redirect(`/programs/community/${slug}`)
  }

  const embedUrl = video.videoUrl ? getVideoEmbedUrl(video.videoUrl) : null

  // Get related videos (other videos in same channel)
  const relatedVideos = await db.query.videos.findMany({
    where: and(
      eq(videos.channelId, channel.id),
      eq(videos.status, "published")
    ),
    limit: 6,
    orderBy: (videos, { desc }) => [desc(videos.episodeNumber)],
  })

  return (
    <SessionProvider>
      <VideoViewTracker videoId={video.id} videoDuration={video.duration || null} />
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link href="/programs/community" className="text-neutral-600 hover:text-neutral-900">
            Online Programs
          </Link>
          <span className="mx-2 text-neutral-400">/</span>
          <Link
            href={`/programs/community/${slug}`}
            className="text-neutral-600 hover:text-neutral-900"
          >
            {channel.title}
          </Link>
          <span className="mx-2 text-neutral-400">/</span>
          <span className="text-neutral-900">{video.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Column */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden mb-6" style={{ aspectRatio: "16/9" }}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <p className="text-lg mb-2">Video Coming Soon</p>
                    <p className="text-sm text-white/70">This episode will be available soon</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                  {video.episodeNumber && (
                    <p className="text-neutral-600">
                      Episode {video.episodeNumber}
                      {video.seasonNumber && video.seasonNumber > 1 && ` • Season ${video.seasonNumber}`}
                    </p>
                  )}
                </div>
                
                {video.isFirstEpisode && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Free Episode
                  </span>
                )}
              </div>

              {video.description && (
                <div className="text-neutral-700 leading-relaxed">
                  {video.description}
                </div>
              )}

              <div className="mt-6 flex items-center gap-4 text-sm text-neutral-600">
                <span>{video.viewCount} views</span>
                {video.duration && (
                  <span>
                    {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <h3 className="font-semibold mb-4">More from {channel.title}</h3>
              
              <div className="space-y-4">
                {relatedVideos
                  .filter((v) => v.id !== video.id)
                  .slice(0, 5)
                  .map((relatedVideo) => {
                    const canAccess =
                      relatedVideo.isFirstEpisode ||
                      userTierLevel >= relatedVideo.requiredTierLevel

                    return (
                      <Link
                        key={relatedVideo.id}
                        href={
                          canAccess
                            ? `/programs/community/${slug}/${relatedVideo.slug}`
                            : "#"
                        }
                        className={`block ${!canAccess ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex gap-3">
                          <div className="relative flex-shrink-0">
                            {relatedVideo.thumbnailUrl ? (
                              <Image
                                src={relatedVideo.thumbnailUrl}
                                alt={relatedVideo.title}
                                width={128}
                                height={80}
                                className="w-32 h-20 object-cover rounded"
                              />
                            ) : (
                              <div className="w-32 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-white"
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
                            {!canAccess && (
                              <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">
                              {relatedVideo.title}
                            </p>
                            {relatedVideo.episodeNumber && (
                              <p className="text-xs text-neutral-600 mt-1">
                                Episode {relatedVideo.episodeNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
              </div>

              <Link href={`/programs/community/${slug}`}>
                <Button variant="outline" className="w-full mt-6">
                  View All Videos
                </Button>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </SessionProvider>
  )
}


import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { communityChannels, videos, userMemberships, channelSections } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SectionSelector } from "@/components/programs/SectionSelector"
import { VideoGrid } from "@/components/programs/VideoGrid"

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
        sections: {
          orderBy: [asc(channelSections.sortOrder)],
          with: {
            videos: {
              where: eq(videos.status, "published"),
              orderBy: [asc(videos.seasonNumber), asc(videos.episodeNumber)],
            },
          },
        },
        videos: {
          where: eq(videos.status, "published"),
          orderBy: [asc(videos.seasonNumber), asc(videos.episodeNumber)],
          with: {
            section: true,
          },
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

  // All videos with access checks
  const allVideos = channel.videos.map((video) => {
    const hasAccess = video.isFirstEpisode || userTierLevel >= video.requiredTierLevel
    return {
      ...video,
      hasAccess,
    }
  })

  // Group videos by section
  const sectionsWithVideos = channel.sections.map((section) => ({
    ...section,
    videos: section.videos.map((video) => {
      const hasAccess = video.isFirstEpisode || userTierLevel >= video.requiredTierLevel
      return {
        ...video,
        hasAccess,
      }
    }),
  }))

  // Videos without sections (for backward compatibility)
  const videosWithoutSection = channel.videos
    .filter((video) => !video.sectionId)
    .map((video) => {
      const hasAccess = video.isFirstEpisode || userTierLevel >= video.requiredTierLevel
      return {
        ...video,
        hasAccess,
      }
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
              ← Back to Online Programs
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
                  {channel.videoCount} {channel.videoCount === 1 ? 'episode' : 'episodes'}
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

      {/* Videos Grid with Sections */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hasChannelAccess && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <p className="text-yellow-900 font-medium mb-2">
              Limited Access
            </p>
            <p className="text-yellow-800 mb-4">
              You can watch the first episode for free. Upgrade your membership to
              access all episodes in this channel.
            </p>
            <Link href="/programs/community#membership-tiers">
              <Button>View Membership Tiers</Button>
            </Link>
          </div>
        )}

        {sectionsWithVideos.length > 0 ? (
          <SectionSelector
            sections={sectionsWithVideos}
            allVideos={allVideos}
            slug={slug}
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Episodes</h2>
            <VideoGrid videos={allVideos} slug={slug} />
          </>
        )}
      </section>
    </div>
  )
}



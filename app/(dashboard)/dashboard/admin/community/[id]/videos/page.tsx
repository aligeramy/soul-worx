import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { communityChannels, videos } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function ChannelVideosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  const channel = await db.query.communityChannels.findFirst({
    where: eq(communityChannels.id, id),
    with: {
      videos: {
        orderBy: [desc(videos.episodeNumber)],
      },
    },
  })

  if (!channel) {
    redirect("/dashboard/admin/community")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin/community"
            className="text-sm text-white/60 hover:text-white mb-2 inline-block"
          >
            ← Back to Channels
          </Link>
          <h1 className="text-3xl font-bold text-white">{channel.title}</h1>
          <p className="text-white/60 mt-2">Manage videos in this channel</p>
        </div>
        <Link href={`/dashboard/admin/community/videos/new?channelId=${channel.id}`}>
          <Button className="bg-white text-black hover:bg-white/90 font-semibold">
            Add Video
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channel.videos.map((video) => (
          <Card key={video.id} className="p-4 bg-[#1c1c1e] border-white/10">
            <div className="space-y-3">
              {video.thumbnailUrl && (
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              
              <div>
                <h3 className="font-semibold text-white">{video.title}</h3>
                {video.episodeNumber && (
                  <p className="text-sm text-white/60">
                    Episode {video.episodeNumber}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`px-2 py-1 rounded ${
                    video.status === "published"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : video.status === "draft"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-white/10 text-white/70 border border-white/20"
                  }`}
                >
                  {video.status}
                </span>
                {video.isFirstEpisode && (
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    First Episode
                  </span>
                )}
              </div>

              <Link href={`/dashboard/admin/community/videos/${video.id}`}>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Edit Video
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {channel.videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60 mb-4">No videos yet</p>
          <Link href={`/dashboard/admin/community/videos/new?channelId=${channel.id}`}>
            <Button className="bg-white text-black hover:bg-white/90 font-semibold">Add Your First Video</Button>
          </Link>
        </div>
      )}
    </div>
  )
}


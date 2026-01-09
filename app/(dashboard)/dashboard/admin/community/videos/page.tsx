import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { videos, communityChannels } from "@/lib/db/schema"
import { desc, eq, asc } from "drizzle-orm"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Pencil, Video as VideoIcon, Eye } from "lucide-react"
import { QuickToggleVideoStatus } from "@/components/admin/quick-toggle-video-status"

export default async function AdminVideosPage() {
  const session = await auth()
  
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  const allVideos = await db.query.videos.findMany({
    orderBy: [
      asc(videos.channelId),
      asc(videos.seasonNumber),
      asc(videos.episodeNumber),
      desc(videos.createdAt), // Fallback for videos without episode numbers
    ],
    with: {
      channel: {
        columns: {
          id: true,
          title: true,
          slug: true,
          category: true,
        },
      },
      createdBy: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  const videosByStatus = {
    published: allVideos.filter(v => v.status === "published"),
    draft: allVideos.filter(v => v.status === "draft"),
    unlisted: allVideos.filter(v => v.status === "unlisted"),
    archived: allVideos.filter(v => v.status === "archived"),
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Online Program Videos</h1>
          <p className="text-white/60 mt-1">Manage videos, descriptions, and metadata for online programs</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/community/videos/new">
            <Button className="bg-white text-black hover:bg-white/90 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              New Video
            </Button>
          </Link>
          <Link href="/dashboard/admin/community">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Manage Channels
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-sm border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider">Published</div>
            <div className="text-3xl font-bold text-white">{videosByStatus.published.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-yellow-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-yellow-400 mb-1 uppercase tracking-wider">Draft</div>
            <div className="text-3xl font-bold text-white">{videosByStatus.draft.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">Unlisted</div>
            <div className="text-3xl font-bold text-white">{videosByStatus.unlisted.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-red-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-red-400 mb-1 uppercase tracking-wider">Archived</div>
            <div className="text-3xl font-bold text-white">{videosByStatus.archived.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Videos Table */}
      {allVideos.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <VideoIcon className="h-8 w-8 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
            <p className="text-white/60 mb-6">Create your first video to get started</p>
            <Link href="/dashboard/admin/community/videos/new">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Create Video
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/60 uppercase tracking-wider" style={{ width: '20%' }}>
                      Video
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/60 uppercase tracking-wider hidden md:table-cell" style={{ width: '12%' }}>
                      Channel
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/60 uppercase tracking-wider hidden lg:table-cell" style={{ width: '8%' }}>
                      Episode
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/60 uppercase tracking-wider hidden lg:table-cell" style={{ width: '15%' }}>
                      Description
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/60 uppercase tracking-wider" style={{ width: '8%' }}>
                      Status
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/60 uppercase tracking-wider hidden xl:table-cell" style={{ width: '6%' }}>
                      Tier
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/60 uppercase tracking-wider hidden md:table-cell" style={{ width: '12%' }}>
                      Stats
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/60 uppercase tracking-wider hidden xl:table-cell" style={{ width: '8%' }}>
                      Created
                    </th>
                    <th className="px-2 py-2 text-right text-xs font-semibold text-white/60 uppercase tracking-wider" style={{ width: '10%' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {allVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          {video.thumbnailUrl ? (
                            <div className="relative w-10 h-7 rounded overflow-hidden bg-white/5 flex-shrink-0">
                              <Image
                                src={video.thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-7 rounded bg-white/5 flex items-center justify-center flex-shrink-0">
                              <VideoIcon className="h-3 w-3 text-white/30" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-white text-xs truncate">{video.title}</div>
                            <div className="text-[10px] text-white/50 truncate hidden md:block">/{video.slug}</div>
                            <div className="text-[10px] text-blue-400 truncate md:hidden">{video.channel.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 hidden md:table-cell">
                        <Link
                          href={`/programs/community/${video.channel.slug}`}
                          className="text-blue-400 hover:text-blue-300 text-xs truncate block"
                          target="_blank"
                        >
                          {video.channel.title}
                        </Link>
                        <div className="text-[10px] text-white/50 truncate">{video.channel.category}</div>
                      </td>
                      <td className="px-2 py-2 hidden lg:table-cell">
                        {video.episodeNumber ? (
                          <div className="text-xs text-white/70">
                            <div>S{video.seasonNumber || 1} E{video.episodeNumber}</div>
                            {video.isFirstEpisode && (
                              <Badge variant="outline" className="mt-1 border-blue-500/30 text-blue-400 text-[10px] px-1 py-0">
                                First
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-white/50">—</span>
                        )}
                      </td>
                      <td className="px-2 py-2 hidden lg:table-cell">
                        {video.description ? (
                          <div className="text-xs text-white/70 line-clamp-2">
                            {video.description}
                          </div>
                        ) : (
                          <span className="text-xs text-white/50 italic">No description</span>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <StatusBadge status={video.status} />
                      </td>
                      <td className="px-2 py-2 hidden xl:table-cell">
                        <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                          T{video.requiredTierLevel}
                        </Badge>
                      </td>
                      <td className="px-2 py-2 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-white/70">
                          <Eye className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="font-medium">{video.viewCount.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-xs text-white/70 whitespace-nowrap hidden xl:table-cell">
                        {format(new Date(video.createdAt), "MMM d")}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-end gap-1">
                          <QuickToggleVideoStatus 
                            videoId={video.id} 
                            currentStatus={video.status}
                          />
                          <Link href={`/programs/community/${video.channel.slug}/${video.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/admin/community/videos/${video.id}`}>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    unlisted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    archived: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <Badge variant="outline" className={`${variants[status as keyof typeof variants]} text-xs px-1.5 py-0.5`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}


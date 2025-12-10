import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { communityChannels } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Pencil, Video as VideoIcon } from "lucide-react"

export default async function AdminCommunityPage() {
  const session = await auth()
  
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  const channels = await db.query.communityChannels.findMany({
    orderBy: [desc(communityChannels.sortOrder), desc(communityChannels.createdAt)],
    with: {
      videos: true,
      createdBy: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  const channelsByStatus = {
    published: channels.filter(c => c.status === "published"),
    draft: channels.filter(c => c.status === "draft"),
    archived: channels.filter(c => c.status === "archived"),
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Online Programs</h1>
          <p className="text-white/60 mt-1">
            Manage video channels and community content
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/community/videos">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <VideoIcon className="mr-2 h-4 w-4" />
              Manage Videos
            </Button>
          </Link>
          <Link href="/dashboard/admin/community/new">
            <Button className="bg-white text-black hover:bg-white/90 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              New Channel
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#1c1c1e] border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider">Published</div>
            <div className="text-3xl font-bold text-white">{channelsByStatus.published.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1c1c1e] border-yellow-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-yellow-400 mb-1 uppercase tracking-wider">Draft</div>
            <div className="text-3xl font-bold text-white">{channelsByStatus.draft.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1c1c1e] border-red-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-red-400 mb-1 uppercase tracking-wider">Archived</div>
            <div className="text-3xl font-bold text-white">{channelsByStatus.archived.length}</div>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<div className="text-white">Loading...</div>}>
        {channels.length === 0 ? (
          <Card className="bg-[#1c1c1e] border-white/10">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-white/40" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No channels yet</h3>
              <p className="text-white/60 mb-6">Create your first channel to get started</p>
              <Link href="/dashboard/admin/community/new">
                <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Channel
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#1c1c1e] border-white/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Channel
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Videos
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Access
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {channels.map((channel) => (
                      <tr key={channel.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {channel.thumbnailImage ? (
                              <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                <Image
                                  src={channel.thumbnailImage}
                                  alt={channel.title}
                                  width={64}
                                  height={48}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                <VideoIcon className="h-6 w-6 text-white/30" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-white">{channel.title}</div>
                              <div className="text-sm text-white/50">/{channel.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          {channel.description ? (
                            <div className="text-sm text-white/70 line-clamp-2">
                              {channel.description}
                            </div>
                          ) : (
                            <span className="text-sm text-white/50 italic">No description</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="border-white/20 text-white/70">
                            {channel.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={channel.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <VideoIcon className="h-4 w-4" />
                            <span>{channel.videoCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="border-white/20 text-white/70">
                            Tier {channel.requiredTierLevel}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/70">
                          {format(new Date(channel.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/programs/community/${channel.slug}`} target="_blank">
                              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/admin/community/${channel.id}/videos`}>
                              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                                <VideoIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/admin/community/${channel.id}`}>
                              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                                <Pencil className="h-4 w-4" />
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
      </Suspense>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    archived: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}


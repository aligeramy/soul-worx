import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { communityChannels } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function AdminCommunityPage() {
  const session = await auth()
  
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  const channels = await db.query.communityChannels.findMany({
    orderBy: [desc(communityChannels.sortOrder), desc(communityChannels.createdAt)],
    with: {
      videos: true,
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Channels</h1>
          <p className="text-neutral-600 mt-2">
            Manage video channels and community content
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/admin/community/videos/new">
            <Button variant="outline">Add Video</Button>
          </Link>
          <Link href="/dashboard/admin/community/new">
            <Button>Create Channel</Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <Card key={channel.id} className="p-6">
              <div className="space-y-4">
                {channel.thumbnailImage && (
                  <img
                    src={channel.thumbnailImage}
                    alt={channel.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h3 className="text-xl font-semibold">{channel.title}</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {channel.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span
                    className={`px-2 py-1 rounded ${
                      channel.status === "published"
                        ? "bg-green-100 text-green-800"
                        : channel.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {channel.status}
                  </span>
                  <span>{channel.videoCount} videos</span>
                  <span>Tier {channel.requiredTierLevel}+</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/admin/community/${channel.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/admin/community/${channel.id}/videos`}
                    className="flex-1"
                  >
                    <Button className="w-full">Manage Videos</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Suspense>

      {channels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600 mb-4">No channels yet</p>
          <Link href="/dashboard/admin/community/new">
            <Button>Create Your First Channel</Button>
          </Link>
        </div>
      )}
    </div>
  )
}


import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { DeleteStoryButton } from "@/components/admin/delete-story-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Pencil, FileText, Eye } from "lucide-react"
import Image from "next/image"

export default async function AdminStoriesPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/signin")
  }

  // Check if user is admin
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user.email!),
  })

  if (user?.role !== "admin" && user?.role !== "super_admin") {
    redirect("/dashboard")
  }

  // Get all stories (posts)
  const allStories = await db.query.posts.findMany({
    orderBy: desc(posts.createdAt),
    with: {
      author: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  const storyTypes = {
    poetry: allStories.filter(s => s.category === "poetry"),
    news: allStories.filter(s => s.category === "news"),
    blog: allStories.filter(s => s.category === "blog"),
    announcements: allStories.filter(s => s.category === "announcements"),
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Stories</h1>
          <p className="text-white/60 mt-1">
            Manage poetry, community highlights, event recaps, and press releases
          </p>
        </div>
        <Link href="/dashboard/admin/stories/new">
          <Button className="bg-white text-black hover:bg-white/90 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Story
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#1c1c1e] border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">Poetry Drops</div>
            <div className="text-3xl font-bold text-white">{storyTypes.poetry.length}</div>
            <div className="text-xs text-blue-400/70 mt-1">
              {storyTypes.poetry.filter(s => s.status === "published").length} published
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1c1c1e] border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-purple-400 mb-1 uppercase tracking-wider">Blog</div>
            <div className="text-3xl font-bold text-white">{storyTypes.blog.length}</div>
            <div className="text-xs text-purple-400/70 mt-1">
              {storyTypes.blog.filter(s => s.status === "published").length} published
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1c1c1e] border-amber-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider">Event Recaps</div>
            <div className="text-3xl font-bold text-white">{storyTypes.news.length}</div>
            <div className="text-xs text-amber-400/70 mt-1">
              {storyTypes.news.filter(s => s.status === "published").length} published
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1c1c1e] border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider">Press & Media</div>
            <div className="text-3xl font-bold text-white">{storyTypes.announcements.length}</div>
            <div className="text-xs text-emerald-400/70 mt-1">
              {storyTypes.announcements.filter(s => s.status === "published").length} published
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Stories */}
      {allStories.length === 0 ? (
        <Card className="bg-[#1c1c1e] border-white/10">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No stories yet</h3>
            <p className="text-white/60 mb-6">Create your first story to get started</p>
            <Link href="/dashboard/admin/stories/new">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Create Story
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
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {allStories.map((story) => (
                    <tr key={story.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {story.coverImage && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                              <Image
                                src={story.coverImage}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate">{story.title}</div>
                            <div className="text-sm text-white/50 line-clamp-1">{story.excerpt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <CategoryBadge category={story.category} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={story.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {story.author.name || story.author.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/70">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">{story.viewCount.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/stories/${story.category}/${story.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/admin/stories/${story.id}`}>
                            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteStoryButton 
                            storyId={story.id} 
                            storyTitle={story.title}
                          />
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

function CategoryBadge({ category }: { category: string }) {
  const variants = {
    poetry: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    stories: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    news: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    announcements: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  }

  return (
    <Badge variant="outline" className={variants[category as keyof typeof variants]}>
      {category}
    </Badge>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    draft: "bg-white/10 text-white/70 border-white/20",
    archived: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

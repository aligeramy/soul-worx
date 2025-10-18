import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"

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
    stories: allStories.filter(s => s.category === "stories"),
    announcements: allStories.filter(s => s.category === "announcements"),
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Stories Management</h1>
          <p className="text-neutral-600 mt-2">
            Manage poetry drops, community highlights, event recaps, and press releases
          </p>
        </div>
        <Link href="/dashboard/admin/stories/new">
          <button className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors">
            + New Story
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
          <div className="text-sm font-bold text-blue-600 mb-2">POETRY DROPS</div>
          <div className="text-4xl font-bold text-blue-900">{storyTypes.poetry.length}</div>
          <div className="text-sm text-blue-600 mt-2">
            {storyTypes.poetry.filter(s => s.status === "published").length} published
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <div className="text-sm font-bold text-purple-600 mb-2">COMMUNITY</div>
          <div className="text-4xl font-bold text-purple-900">{storyTypes.stories.length}</div>
          <div className="text-sm text-purple-600 mt-2">
            {storyTypes.stories.filter(s => s.status === "published").length} published
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
          <div className="text-sm font-bold text-amber-600 mb-2">EVENT RECAPS</div>
          <div className="text-4xl font-bold text-amber-900">{storyTypes.news.length}</div>
          <div className="text-sm text-amber-600 mt-2">
            {storyTypes.news.filter(s => s.status === "published").length} published
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-100">
          <div className="text-sm font-bold text-green-600 mb-2">PRESS & MEDIA</div>
          <div className="text-4xl font-bold text-green-900">{storyTypes.announcements.length}</div>
          <div className="text-sm text-green-600 mt-2">
            {storyTypes.announcements.filter(s => s.status === "published").length} published
          </div>
        </div>
      </div>

      {/* All Stories Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold">All Stories</h2>
        </div>
        
        {allStories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No stories yet</h3>
            <p className="text-neutral-600 mb-6">Create your first story to get started</p>
            <Link href="/dashboard/admin/stories/new">
              <button className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors">
                Create Story
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {allStories.map((story) => (
                  <tr key={story.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {story.coverImage && (
                          <img
                            src={story.coverImage}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="font-bold text-neutral-900">{story.title}</div>
                          <div className="text-sm text-neutral-500 line-clamp-1">{story.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                        ${story.category === "poetry" ? "bg-blue-100 text-blue-700" : ""}
                        ${story.category === "stories" ? "bg-purple-100 text-purple-700" : ""}
                        ${story.category === "news" ? "bg-amber-100 text-amber-700" : ""}
                        ${story.category === "announcements" ? "bg-green-100 text-green-700" : ""}
                      `}>
                        {story.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                        ${story.status === "published" ? "bg-green-100 text-green-700" : ""}
                        ${story.status === "draft" ? "bg-neutral-100 text-neutral-700" : ""}
                        ${story.status === "archived" ? "bg-red-100 text-red-700" : ""}
                      `}>
                        {story.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {story.author.name || story.author.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {story.viewCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/stories/${story.category}/${story.slug}`}
                          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          target="_blank"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/dashboard/admin/stories/${story.id}`}
                          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button 
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this story?")) {
                              await fetch(`/api/stories/${story.id}`, { method: "DELETE" })
                              window.location.reload()
                            }
                          }}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}


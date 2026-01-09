import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { StoryForm } from "@/components/admin/story-form"

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  const { id } = await params
  const story = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, id),
  })

  if (!story) {
    redirect("/dashboard/admin/stories")
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm [&_*]:text-neutral-900 [&_label]:text-neutral-900 [&_p]:text-neutral-600 [&_span]:text-neutral-600">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">Edit Story</h1>
          <p className="text-neutral-600 mt-2">
            Update story details
          </p>
        </div>

        <StoryForm story={{
          ...story,
          tags: story.tags || []
        }} />
      </div>
    </div>
  )
}


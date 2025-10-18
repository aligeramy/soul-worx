import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { videos } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { VideoForm } from "@/components/admin/video-form"

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params
  
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  const video = await db.query.videos.findFirst({
    where: eq(videos.id, id),
  })

  if (!video) {
    redirect("/dashboard/admin/community")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Video</h1>
        <p className="text-neutral-600 mt-2">
          Update video details and settings
        </p>
      </div>

      <VideoForm video={video} />
    </div>
  )
}


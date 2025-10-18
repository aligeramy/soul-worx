import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { VideoForm } from "@/components/admin/video-form"

export default async function NewVideoPage({
  searchParams,
}: {
  searchParams: Promise<{ channelId?: string }>
}) {
  const session = await auth()
  const params = await searchParams
  
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Add Video</h1>
        <p className="text-neutral-600 mt-2">
          Add a new video to a community channel
        </p>
      </div>

      <VideoForm channelId={params.channelId} />
    </div>
  )
}


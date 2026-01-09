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
    <div className="bg-white rounded-lg p-8 shadow-sm [&_*]:text-neutral-900 [&_label]:text-neutral-900 [&_p]:text-neutral-600 [&_span]:text-neutral-600">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Add Video</h1>
          <p className="text-neutral-600 mt-2">
            Add a new video to a community channel
          </p>
        </div>

        <VideoForm channelId={params.channelId} />
      </div>
    </div>
  )
}


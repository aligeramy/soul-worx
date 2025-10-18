import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { communityChannels } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { ChannelForm } from "@/components/admin/channel-form"

export default async function EditChannelPage({
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
  })

  if (!channel) {
    redirect("/dashboard/admin/community")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Channel</h1>
        <p className="text-neutral-600 mt-2">
          Update channel details and settings
        </p>
      </div>

      <ChannelForm channel={channel} />
    </div>
  )
}


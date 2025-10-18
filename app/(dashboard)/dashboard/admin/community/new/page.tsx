import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ChannelForm } from "@/components/admin/channel-form"

export default async function NewChannelPage() {
  const session = await auth()
  
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Community Channel</h1>
        <p className="text-neutral-600 mt-2">
          Create a new channel to organize video content
        </p>
      </div>

      <ChannelForm />
    </div>
  )
}


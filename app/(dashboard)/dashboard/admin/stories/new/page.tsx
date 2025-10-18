import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { StoryForm } from "@/components/admin/story-form"

export default async function NewStoryPage() {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">New Story</h1>
        <p className="text-neutral-600 mt-2">
          Create a new story, poetry drop, event recap, or announcement
        </p>
      </div>

      <StoryForm />
    </div>
  )
}


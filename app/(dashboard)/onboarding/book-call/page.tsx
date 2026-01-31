import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserTier } from "@/lib/db/queries"
import { BookCoachCall } from "@/components/onboarding/book-coach-call"

export default async function BookCoachCallPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  if (isAdmin) {
    redirect("/dashboard")
  }

  // Verify user is Pro+
  const tier = await getUserTier(session.user.id)
  if (tier !== "pro_plus") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="w-full max-w-4xl">
        <BookCoachCall userId={session.user.id} />
      </div>
    </div>
  )
}

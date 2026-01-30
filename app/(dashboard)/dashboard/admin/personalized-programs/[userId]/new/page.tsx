import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { CreatePersonalizedProgramForm } from "@/components/admin/create-personalized-program-form"

export default async function CreateProgramPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const session = await auth()
  const { userId } = await params

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) {
    redirect("/dashboard/admin/personalized-programs")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">
          Create Program for {user.name || user.email}
        </h1>
        <p className="text-white/60 -mt-1">Create a personalized training program</p>
      </div>

      <CreatePersonalizedProgramForm userId={userId} adminId={session.user.id} />
    </div>
  )
}

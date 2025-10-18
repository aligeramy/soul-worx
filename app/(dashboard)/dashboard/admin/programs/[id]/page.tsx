import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { ProgramForm } from "@/components/admin/program-form"

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  const { id } = await params
  const program = await db.query.programs.findFirst({
    where: (programs, { eq }) => eq(programs.id, id),
  })

  if (!program) {
    redirect("/dashboard/admin/programs")
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Edit Program</h1>
        <p className="text-neutral-600 mt-2">
          Update program details
        </p>
      </div>

      <ProgramForm program={program} />
    </div>
  )
}


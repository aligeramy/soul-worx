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
    <div className="bg-white rounded-lg p-8 shadow-sm [&_*]:text-neutral-900 [&_label]:text-neutral-900 [&_p]:text-neutral-600 [&_span]:text-neutral-600">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">Edit Program</h1>
          <p className="text-neutral-600 mt-2">
            Update program details
          </p>
        </div>

        <ProgramForm program={{
          ...program,
          images: program.images || [],
          tags: program.tags || [],
          faqs: program.faqs || [],
          requirements: (program.requirements as { id: string; text: string; checked: boolean }[] | undefined) || []
        }} />
      </div>
    </div>
  )
}


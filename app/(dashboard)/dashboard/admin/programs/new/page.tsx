import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProgramForm } from "@/components/admin/program-form"

export default async function NewProgramPage() {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm [&_*]:text-neutral-900 [&_label]:text-neutral-900 [&_p]:text-neutral-600 [&_span]:text-neutral-600">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">New Program</h1>
          <p className="text-neutral-600 mt-2">
            Create a new program or workshop
          </p>
        </div>

        <ProgramForm />
      </div>
    </div>
  )
}


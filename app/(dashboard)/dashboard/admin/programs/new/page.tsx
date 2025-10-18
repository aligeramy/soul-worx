import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProgramForm } from "@/components/admin/program-form"

export default async function NewProgramPage() {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">New Program</h1>
        <p className="text-neutral-600 mt-2">
          Create a new program or workshop
        </p>
      </div>

      <ProgramForm />
    </div>
  )
}


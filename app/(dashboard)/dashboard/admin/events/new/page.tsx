import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { EventForm } from "@/components/admin/event-form"

export default async function NewEventPage() {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  const programs = await db.query.programs.findMany({
    columns: {
      id: true,
      title: true,
    },
    where: (programs, { eq }) => eq(programs.status, "published"),
  })

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">New Event</h1>
        <p className="text-neutral-600 mt-2">
          Create a new event or session
        </p>
      </div>

      <EventForm programs={programs} />
    </div>
  )
}


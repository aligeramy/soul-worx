import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { EventForm } from "@/components/admin/event-form"

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  const { id } = await params
  const event = await db.query.events.findFirst({
    where: (events, { eq }) => eq(events.id, id),
  })

  if (!event) {
    redirect("/dashboard/admin/events")
  }

  const programs = await db.query.programs.findMany({
    columns: {
      id: true,
      title: true,
    },
    where: (programs, { eq }) => eq(programs.status, "published"),
  })

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm [&_*]:text-neutral-900 [&_label]:text-neutral-900 [&_p]:text-neutral-600 [&_span]:text-neutral-600">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">Edit Event</h1>
          <p className="text-neutral-600 mt-2">
            Update event details
          </p>
        </div>

        <EventForm event={event} programs={programs} />
      </div>
    </div>
  )
}


import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { personalizedPrograms, programChecklistItems } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"
import { getUserTier } from "@/lib/db/queries"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, CheckCircle2, XCircle, Clock, Star } from "lucide-react"
import { format, isPast, differenceInDays, isToday, startOfDay } from "date-fns"
import { ProgramChecklist } from "@/components/personalized-programs/program-checklist"

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ programId: string }>
}) {
  const session = await auth()
  const { programId } = await params

  if (!session?.user) {
    redirect("/dashboard")
  }

  const userTier = await getUserTier(session.user.id)

  if (userTier !== "pro_plus") {
    redirect("/dashboard")
  }

  // Get program with checklist items
  const program = await db.query.personalizedPrograms.findFirst({
    where: eq(personalizedPrograms.id, programId),
    with: {
      checklistItems: {
        orderBy: asc(programChecklistItems.dueDate),
      },
    },
  })

  if (!program || program.userId !== session.user.id) {
    redirect("/dashboard/personalized-programs")
  }

  const completedCount = program.checklistItems.filter((item) => item.completed).length
  const totalCount = program.checklistItems.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/personalized-programs">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">
              {program.title}
            </h1>
            <p className="text-white/60 -mt-1">Personalized training program</p>
          </div>
        </div>
        <Badge variant="outline" className="capitalize border-white/20 text-white">
          {program.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Program Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Program Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-white/60 mb-2">Description</p>
                <p className="text-white">{program.description}</p>
              </div>

              <div>
                <p className="text-sm text-white/60 mb-2">Date Range</p>
                <p className="text-white">
                  {format(new Date(program.startDate), "MMM d")} -{" "}
                  {format(new Date(program.endDate), "MMM d, yyyy")}
                </p>
              </div>

              {program.trainingDays && Array.isArray(program.trainingDays) && (
                <div>
                  <p className="text-sm text-white/60 mb-2">Training Days</p>
                  <div className="flex flex-wrap gap-2">
                    {program.trainingDays.map((day: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-white/20 text-white"
                      >
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-white/60 mb-2">Progress</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Completed</span>
                    <span className="text-white font-semibold">
                      {completedCount} / {totalCount}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/60">{completionRate}% complete</p>
                </div>
              </div>

              {program.videoUrl && (
                <div>
                  <p className="text-sm text-white/60 mb-2">Training Video</p>
                  <video
                    src={program.videoUrl}
                    controls
                    className="w-full rounded border border-white/10"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Checklist */}
        <div className="lg:col-span-2">
          <ProgramChecklist programId={program.id} checklistItems={program.checklistItems} />
        </div>
      </div>
    </div>
  )
}

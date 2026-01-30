import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { personalizedPrograms, programChecklistItems } from "@/lib/db/schema"
import { eq, asc, desc } from "drizzle-orm"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, CheckCircle2, XCircle, Clock, Star } from "lucide-react"
import { format, isPast, differenceInDays } from "date-fns"

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ userId: string; programId: string }>
}) {
  const session = await auth()
  const { userId, programId } = await params

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  // Get program with checklist items
  const program = await db.query.personalizedPrograms.findFirst({
    where: eq(personalizedPrograms.id, programId),
    with: {
      checklistItems: {
        orderBy: asc(programChecklistItems.dueDate),
      },
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!program || program.userId !== userId) {
    redirect("/dashboard/admin/personalized-programs")
  }

  const completedCount = program.checklistItems.filter((item) => item.completed).length
  const totalCount = program.checklistItems.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/admin/personalized-programs/${userId}`}>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">
              {program.title}
            </h1>
            <p className="text-white/60 -mt-1">Program for {program.user?.name || program.user?.email}</p>
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
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Workout Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              {program.checklistItems.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {program.checklistItems.map((item) => {
                    const dueDate = new Date(item.dueDate)
                    const isOverdue = isPast(dueDate) && !item.completed
                    const daysLate = item.completed && item.completedAt
                      ? Math.max(0, differenceInDays(new Date(item.completedAt), dueDate))
                      : 0

                    return (
                      <div
                        key={item.id}
                        className={`
                          p-4 rounded-lg border transition-all
                          ${
                            item.completed
                              ? "bg-green-500/10 border-green-500/30"
                              : isOverdue
                              ? "bg-red-500/10 border-red-500/30"
                              : "bg-white/5 border-white/10"
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-0.5">
                              {item.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-white/40" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="h-4 w-4 text-white/60" />
                                <span className="text-white font-medium">
                                  {format(dueDate, "EEEE, MMMM d, yyyy")}
                                </span>
                                {item.completed && item.completedAt && (
                                  <span className="text-xs text-white/60">
                                    (Completed {format(new Date(item.completedAt), "MMM d")})
                                  </span>
                                )}
                              </div>
                              {item.completed && (
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  {item.enjoymentRating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <span className="text-white/80">
                                        Enjoyment: {item.enjoymentRating}/5
                                      </span>
                                    </div>
                                  )}
                                  {item.difficultyRating && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-white/60" />
                                      <span className="text-white/80">
                                        Difficulty: {item.difficultyRating}/5
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {daysLate > 0 && (
                                <Badge
                                  variant="outline"
                                  className="mt-2 border-red-500/50 text-red-400"
                                >
                                  {daysLate} day{daysLate !== 1 ? "s" : ""} late
                                </Badge>
                              )}
                              {!item.completed && !isOverdue && (
                                <Badge
                                  variant="outline"
                                  className="mt-2 border-blue-500/50 text-blue-400"
                                >
                                  Upcoming
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">No checklist items found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserTier, getUserPersonalizedPrograms } from "@/lib/db/queries"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight, Target, CheckCircle2, Clock } from "lucide-react"
import { format, isPast, differenceInDays } from "date-fns"

export default async function PersonalizedProgramsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/dashboard")
  }

  const userTier = await getUserTier(session.user.id)

  if (userTier !== "pro_plus") {
    redirect("/dashboard")
  }

  const programs = await getUserPersonalizedPrograms(session.user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">
          Your Personal Programs
        </h1>
        <p className="text-white/60 -mt-1">
          Personalized training programs designed just for you
        </p>
      </div>

      {/* Programs List */}
      {programs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const completedCount = program.checklistItems.filter((item) => item.completed).length
            const totalCount = program.checklistItems.length
            const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

            // Find next due date
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const nextDue = program.checklistItems.find((item) => {
              if (item.completed) return false
              const dueDate = new Date(item.dueDate)
              dueDate.setHours(0, 0, 0, 0)
              return dueDate >= today
            })

            return (
              <Link
                key={program.id}
                href={`/dashboard/personalized-programs/${program.id}`}
                className="block group"
              >
                <Card className="border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all h-full flex flex-col">
                  {(program.videoUrl ?? program.thumbnailUrl) && (
                    <div className="relative aspect-video overflow-hidden">
                      <video
                        src={program.videoUrl ?? undefined}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white group-hover:text-white/80 transition-colors">
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-white/70 text-sm mb-4 line-clamp-2 flex-1">
                      {program.description}
                    </p>

                    <div className="space-y-3">
                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/60">Progress</span>
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
                      </div>

                      {/* Training Days */}
                      {program.trainingDays && Array.isArray(program.trainingDays) && (
                        <div className="flex flex-wrap gap-2">
                          {program.trainingDays.slice(0, 3).map((day: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-white/20 text-white/80 text-xs"
                            >
                              {day.slice(0, 3)}
                            </Badge>
                          ))}
                          {program.trainingDays.length > 3 && (
                            <Badge
                              variant="outline"
                              className="border-white/20 text-white/80 text-xs"
                            >
                              +{program.trainingDays.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Next Due Date */}
                      {nextDue ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-white/60" />
                          <span className="text-white/80">
                            Next: {format(new Date(nextDue.dueDate), "MMM d")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>All workouts completed!</span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      className="mt-4 w-full text-white/70 hover:text-white hover:bg-white/10"
                    >
                      View Program
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <Target className="w-12 h-12 text-white/40 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">No Programs Yet</h3>
                <p className="text-white/60">
                  Your personalized training programs will appear here once they&apos;re created
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

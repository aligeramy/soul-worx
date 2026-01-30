import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users, proPlusQuestionnaires, personalizedPrograms } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, FileText, Calendar, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const session = await auth()
  const { userId } = await params

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  // Get user
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) {
    redirect("/dashboard/admin/personalized-programs")
  }

  // Get questionnaire
  const questionnaire = await db.query.proPlusQuestionnaires.findFirst({
    where: eq(proPlusQuestionnaires.userId, userId),
  })

  // Get programs
  const programs = await db.query.personalizedPrograms.findMany({
    where: eq(personalizedPrograms.userId, userId),
    orderBy: desc(personalizedPrograms.createdAt),
    with: {
      createdByUser: {
        columns: {
          name: true,
          email: true,
        },
      },
      checklistItems: true,
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/personalized-programs">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">
              {user.name || "User"}
            </h1>
            <p className="text-white/60 -mt-1">{user.email}</p>
          </div>
        </div>
        <Link href={`/dashboard/admin/personalized-programs/${userId}/new`}>
          <Button className="bg-white/10 hover:bg-white/20 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Program
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Questionnaire Section */}
        <div className="lg:col-span-1">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Questionnaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              {questionnaire ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  {questionnaire.completedAt && (
                    <p className="text-xs text-white/60">
                      Completed: {format(new Date(questionnaire.completedAt), "MMM d, yyyy")}
                    </p>
                  )}
                  <Link href={`/dashboard/admin/personalized-programs/${userId}/questionnaire`}>
                    <Button variant="outline" size="sm" className="w-full mt-4 text-white/70 border-white/20">
                      View Answers
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/60 text-sm">Questionnaire not completed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Programs Section */}
        <div className="lg:col-span-2">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Programs ({programs.length})</CardTitle>
              <CardDescription className="text-white/60">
                Personalized training programs for this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              {programs.length > 0 ? (
                <div className="space-y-4">
                  {programs.map((program) => (
                    <Link
                      key={program.id}
                      href={`/dashboard/admin/personalized-programs/${userId}/programs/${program.id}`}
                      className="block"
                    >
                      <Card className="border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {program.title}
                              </h3>
                              <p className="text-sm text-white/70 line-clamp-2 mb-3">
                                {program.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-white/60">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {format(new Date(program.startDate), "MMM d")} -{" "}
                                    {format(new Date(program.endDate), "MMM d, yyyy")}
                                  </span>
                                </div>
                                {program.trainingDays && Array.isArray(program.trainingDays) && (
                                  <span>
                                    {program.trainingDays.length} day
                                    {program.trainingDays.length !== 1 ? "s" : ""}/week
                                  </span>
                                )}
                                <span className="capitalize">{program.status}</span>
                              </div>
                            </div>
                            {program.videoUrl && (
                              <div className="w-24 h-16 rounded bg-white/10 flex-shrink-0 overflow-hidden">
                                <video
                                  src={program.videoUrl}
                                  className="w-full h-full object-cover"
                                  muted
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60 mb-4">No programs created yet</p>
                  <Link href={`/dashboard/admin/personalized-programs/${userId}/new`}>
                    <Button variant="outline" className="text-white/70 border-white/20">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Program
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

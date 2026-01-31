import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users, proPlusQuestionnaires, personalizedPrograms } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  FileText,
  FileQuestion,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { format } from "date-fns"

function DetailRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <>
      <dt className="py-1.5 text-sm font-normal text-white/50">{label}</dt>
      <dd className="py-1.5 text-sm text-white/90 min-w-0 break-words">{value}</dd>
    </>
  )
}

function SectionBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-white/[0.08] py-5 first:pt-0">
      <h2 className="font-sans text-xs font-medium uppercase tracking-wider text-white/50 mb-3">
        {title}
      </h2>
      <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-x-6 gap-y-0">{children}</dl>
    </section>
  )
}

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

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) {
    redirect("/dashboard/admin/personalized-programs")
  }

  const [questionnaire, programs] = await Promise.all([
    db.query.proPlusQuestionnaires.findFirst({
      where: eq(proPlusQuestionnaires.userId, userId),
    }),
    db.query.personalizedPrograms.findMany({
      where: eq(personalizedPrograms.userId, userId),
      orderBy: asc(personalizedPrograms.startDate),
      with: {
        createdByUser: {
          columns: {
            name: true,
            email: true,
          },
        },
        checklistItems: true,
      },
    }),
  ])

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

      {/* Two-column layout: left = questionnaire (questions & results), right = programs (sticky) */}
      <div className="flex gap-6 flex-col lg:flex-row lg:items-start">
        {/* Left: Questionnaire & Results */}
        <div className="min-w-0 flex-2 space-y-6">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Questionnaire & Results
              </CardTitle>
              <CardDescription className="text-white/60">
                {questionnaire ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    Completed{" "}
                    {questionnaire.completedAt &&
                      format(new Date(questionnaire.completedAt), "MMM d, yyyy")}
                  </span>
                ) : (
                  "Not completed"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questionnaire ? (
                <article>
                  {/* Basic Info */}
                  {(questionnaire.age ||
                    questionnaire.skillLevel ||
                    questionnaire.position ||
                    questionnaire.weight ||
                    questionnaire.height ||
                    questionnaire.gameDescription) && (
                    <SectionBlock title="Basic information">
                      {questionnaire.age && (
                        <DetailRow label="Age" value={questionnaire.age} />
                      )}
                      {questionnaire.skillLevel && (
                        <DetailRow
                          label="Skill level"
                          value={<span className="capitalize">{questionnaire.skillLevel}</span>}
                        />
                      )}
                      {questionnaire.position && (
                        <DetailRow label="Position" value={questionnaire.position} />
                      )}
                      {questionnaire.weight && (
                        <DetailRow label="Weight" value={`${questionnaire.weight} lbs`} />
                      )}
                      {questionnaire.height && (
                        <DetailRow label="Height" value={questionnaire.height} />
                      )}
                      {questionnaire.gameDescription && (
                        <DetailRow
                          label="Game description"
                          value={
                            <span className="whitespace-pre-wrap break-words">
                              {questionnaire.gameDescription}
                            </span>
                          }
                        />
                      )}
                    </SectionBlock>
                  )}

                  {/* Goals */}
                  {(questionnaire.currentGoalsYearly || questionnaire.currentGoalsOverall) && (
                    <SectionBlock title="Goals">
                      {questionnaire.currentGoalsYearly && (
                        <DetailRow
                          label="Yearly goals"
                          value={
                            <span className="whitespace-pre-wrap break-words">
                              {questionnaire.currentGoalsYearly}
                            </span>
                          }
                        />
                      )}
                      {questionnaire.currentGoalsOverall && (
                        <DetailRow
                          label="Overall goals"
                          value={
                            <span className="whitespace-pre-wrap break-words">
                              {questionnaire.currentGoalsOverall}
                            </span>
                          }
                        />
                      )}
                    </SectionBlock>
                  )}

                  {/* Improvement rankings */}
                  {questionnaire.improvementRankings && (
                    <SectionBlock title="Improvement priorities">
                      {(
                        Object.entries(
                          questionnaire.improvementRankings as Record<
                            string,
                            number | { text: string; rank: number }
                          >
                        )
                          .filter(([key, value]) => {
                            if (key === "other" && typeof value === "object")
                              return !!(value.text && value.text.trim())
                            return typeof value === "number"
                          })
                          .sort(([, a], [, b]) => {
                            const rankA = typeof a === "number" ? a : a.rank
                            const rankB = typeof b === "number" ? b : b.rank
                            return rankB - rankA
                          })
                      ).map(([key, value]) => {
                        if (key === "other" && typeof value === "object") {
                          return (
                            <DetailRow
                              key={key}
                              label={<span className="capitalize">Other ({value.text})</span>}
                              value={`${value.rank}/5`}
                            />
                          )
                        }
                        if (typeof value === "number") {
                          return (
                            <DetailRow
                              key={key}
                              label={
                                <span className="capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                              }
                              value={`${value}/5`}
                            />
                          )
                        }
                        return null
                      })}
                    </SectionBlock>
                  )}

                  {/* Training & health */}
                  <SectionBlock title="Training & health">
                    <DetailRow
                      label="Physiotherapy"
                      value={questionnaire.seeingPhysiotherapy ? "Yes" : "No"}
                    />
                    <DetailRow
                      label="Weight training"
                      value={questionnaire.weightTrains ? "Yes" : "No"}
                    />
                    <DetailRow
                      label="Stretches"
                      value={questionnaire.stretches ? "Yes" : "No"}
                    />
                    {questionnaire.currentInjuries && (
                      <DetailRow
                        label="Current injuries"
                        value={
                          <span className="whitespace-pre-wrap break-words">
                            {questionnaire.currentInjuries}
                          </span>
                        }
                      />
                    )}
                  </SectionBlock>

                  {/* Team & competition */}
                  {(questionnaire.currentTeam ||
                    questionnaire.outsideSchoolTeams ||
                    questionnaire.inSeason !== undefined) && (
                    <SectionBlock title="Team & competition">
                      {questionnaire.currentTeam && (
                        <DetailRow label="Current team" value={questionnaire.currentTeam} />
                      )}
                      {questionnaire.outsideSchoolTeams && (
                        <DetailRow
                          label="Outside school teams"
                          value={questionnaire.outsideSchoolTeams}
                        />
                      )}
                      <DetailRow
                        label="In season"
                        value={questionnaire.inSeason ? "Yes" : "No"}
                      />
                    </SectionBlock>
                  )}

                  {/* Equipment & availability */}
                  {(questionnaire.equipmentAccess ||
                    questionnaire.trainingDays ||
                    questionnaire.averageSessionLength) && (
                    <SectionBlock title="Equipment & availability">
                      {questionnaire.equipmentAccess && (
                        <DetailRow
                          label="Equipment access"
                          value={questionnaire.equipmentAccess}
                        />
                      )}
                      {questionnaire.averageSessionLength && (
                        <DetailRow
                          label="Session length"
                          value={`${questionnaire.averageSessionLength} min`}
                        />
                      )}
                      {questionnaire.trainingDays &&
                        Array.isArray(questionnaire.trainingDays) &&
                        questionnaire.trainingDays.length > 0 && (
                          <>
                            <dt className="py-1.5 text-sm font-normal text-white/50">
                              Training days
                            </dt>
                            <dd className="py-1.5">
                              <div className="flex flex-wrap gap-1.5">
                                {questionnaire.trainingDays.map((day: string, index: number) => (
                                  <Badge
                                    key={`${day}-${index}`}
                                    variant="outline"
                                    className="border-white/15 bg-white/[0.04] text-white/80 font-normal text-xs"
                                  >
                                    {day}
                                  </Badge>
                                ))}
                              </div>
                            </dd>
                          </>
                        )}
                    </SectionBlock>
                  )}

                  {/* Mental & coaching */}
                  {(questionnaire.biggestStruggle ||
                    questionnaire.confidenceLevel ||
                    questionnaire.mentalChallenge ||
                    questionnaire.coachability ||
                    questionnaire.preferredCoachingStyle) && (
                    <SectionBlock title="Mental & coaching">
                      {questionnaire.biggestStruggle && (
                        <DetailRow
                          label="Biggest struggle"
                          value={
                            <span className="whitespace-pre-wrap break-words">
                              {questionnaire.biggestStruggle}
                            </span>
                          }
                        />
                      )}
                      {questionnaire.confidenceLevel && (
                        <DetailRow
                          label="Confidence level"
                          value={`${questionnaire.confidenceLevel}/5`}
                        />
                      )}
                      {questionnaire.coachability && (
                        <DetailRow label="Coachability" value={`${questionnaire.coachability}/5`} />
                      )}
                      {questionnaire.mentalChallenge && (
                        <DetailRow
                          label="Mental challenge"
                          value={
                            <span className="capitalize">
                              {questionnaire.mentalChallenge}
                              {questionnaire.mentalChallengeOther &&
                                ` — ${questionnaire.mentalChallengeOther}`}
                            </span>
                          }
                        />
                      )}
                      {questionnaire.preferredCoachingStyle && (
                        <DetailRow
                          label="Preferred coaching style"
                          value={
                            <span className="capitalize">
                              {questionnaire.preferredCoachingStyle}
                              {questionnaire.coachingStyleOther &&
                                ` — ${questionnaire.coachingStyleOther}`}
                            </span>
                          }
                        />
                      )}
                    </SectionBlock>
                  )}

                  {/* Videos */}
                  {(questionnaire.gameFilmUrl ||
                    (questionnaire.workoutVideos &&
                      Array.isArray(questionnaire.workoutVideos) &&
                      questionnaire.workoutVideos.length > 0)) && (
                    <SectionBlock title="Videos">
                      {questionnaire.gameFilmUrl && (
                        <>
                          <dt className="py-1.5 text-sm font-normal text-white/50">Game film</dt>
                          <dd className="py-1.5 text-sm text-white/90">
                            <a
                              href={questionnaire.gameFilmUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/80 rounded"
                            >
                              <span className="min-w-0 truncate">{questionnaire.gameFilmUrl}</span>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            </a>
                          </dd>
                        </>
                      )}
                      {questionnaire.workoutVideos &&
                        Array.isArray(questionnaire.workoutVideos) &&
                        questionnaire.workoutVideos.length > 0 && (
                          <>
                            <dt className="py-1.5 text-sm font-normal text-white/50">
                              Workout videos
                            </dt>
                            <dd className="space-y-1 py-1.5">
                              {questionnaire.workoutVideos.map((url: string, index: number) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/80 rounded w-fit"
                                >
                                  Video {index + 1}
                                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                </a>
                              ))}
                            </dd>
                          </>
                        )}
                    </SectionBlock>
                  )}

                  {questionnaire.completedAt && (
                    <footer className="border-t border-white/[0.08] pt-4 mt-4">
                      <p className="font-sans text-xs font-normal text-white/50 tabular-nums">
                        Completed{" "}
                        {format(
                          new Date(questionnaire.completedAt),
                          "MMMM d, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </footer>
                  )}
                </article>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileQuestion className="h-10 w-10 text-white/40 mb-4" aria-hidden />
                  <h2 className="font-sans text-lg font-normal text-white/90">
                    Questionnaire not completed
                  </h2>
                  <p className="mt-2 font-sans text-sm font-normal text-white/55">
                    This user has not submitted their Pro+ questionnaire yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Programs (sticky) */}
        <div className="flex-5 lg:sticky lg:top-6 min-w-0">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Programs ({programs.length})
              </CardTitle>
              <CardDescription className="text-white/60">
                Personalized training programs
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {programs.length > 0 ? (
                <div className="overflow-x-auto max-h-[calc(100vh-12rem)] overflow-y-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10 sticky top-0 bg-white/5 backdrop-blur-sm z-10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Program
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {programs.map((program) => {
                        const checklistItems = program.checklistItems ?? []
                        const completedCount = checklistItems.filter((i) => i.completed).length
                        const totalCount = checklistItems.length

                        const statusVariant =
                          program.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : program.status === "paused"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-sky-500/20 text-sky-400 border-sky-500/30"

                        return (
                          <tr key={program.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="min-w-0">
                                <div className="font-medium text-white">{program.title}</div>
                                <div className="text-sm text-white/50 line-clamp-1">
                                  {program.description}
                                </div>
                                {totalCount > 0 && (
                                  <span className="flex items-center gap-1.5 text-xs text-white/60 mt-1">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/80" />
                                    {completedCount}/{totalCount}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-white/70 whitespace-nowrap">
                              {format(new Date(program.startDate), "MMM d")} –{" "}
                              {format(new Date(program.endDate), "MMM d, yyyy")}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className={statusVariant}>
                                {program.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href={`/dashboard/admin/personalized-programs/${userId}/programs/${program.id}`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white/70 hover:text-white hover:bg-white/10"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 px-6">
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

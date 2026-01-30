import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users, proPlusQuestionnaires } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"

export default async function QuestionnairePage({
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

  const questionnaire = await db.query.proPlusQuestionnaires.findFirst({
    where: eq(proPlusQuestionnaires.userId, userId),
  })

  if (!user) {
    redirect("/dashboard/admin/personalized-programs")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/admin/personalized-programs/${userId}`}>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">
            Questionnaire - {user.name || "User"}
          </h1>
          <p className="text-white/60 -mt-1">View questionnaire answers</p>
        </div>
      </div>

      {questionnaire ? (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Questionnaire Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {questionnaire.age && (
                  <div>
                    <span className="text-white/60">Age:</span>
                    <span className="text-white ml-2">{questionnaire.age}</span>
                  </div>
                )}
                {questionnaire.skillLevel && (
                  <div>
                    <span className="text-white/60">Skill Level:</span>
                    <span className="text-white ml-2 capitalize">{questionnaire.skillLevel}</span>
                  </div>
                )}
                {questionnaire.position && (
                  <div>
                    <span className="text-white/60">Position:</span>
                    <span className="text-white ml-2">{questionnaire.position}</span>
                  </div>
                )}
                {questionnaire.weight && (
                  <div>
                    <span className="text-white/60">Weight:</span>
                    <span className="text-white ml-2">{questionnaire.weight} lbs</span>
                  </div>
                )}
                {questionnaire.height && (
                  <div>
                    <span className="text-white/60">Height:</span>
                    <span className="text-white ml-2">{questionnaire.height}</span>
                  </div>
                )}
              </div>
              {questionnaire.gameDescription && (
                <div className="mt-4">
                  <span className="text-white/60 block mb-1">Game Description:</span>
                  <p className="text-white">{questionnaire.gameDescription}</p>
                </div>
              )}
            </div>

            {/* Goals */}
            {(questionnaire.currentGoalsYearly || questionnaire.currentGoalsOverall) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Goals</h3>
                {questionnaire.currentGoalsYearly && (
                  <div className="mb-3">
                    <span className="text-white/60 block mb-1">Yearly Goals:</span>
                    <p className="text-white">{questionnaire.currentGoalsYearly}</p>
                  </div>
                )}
                {questionnaire.currentGoalsOverall && (
                  <div>
                    <span className="text-white/60 block mb-1">Overall Goals:</span>
                    <p className="text-white">{questionnaire.currentGoalsOverall}</p>
                  </div>
                )}
              </div>
            )}

            {/* Improvement Rankings */}
            {questionnaire.improvementRankings && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Improvement Priorities</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(questionnaire.improvementRankings as Record<string, number | { text: string; rank: number }>).map(
                    ([key, value]) => {
                      if (key === "other" && typeof value === "object") {
                        return (
                          <div key={key}>
                            <span className="text-white/60">Other ({value.text}):</span>
                            <span className="text-white ml-2">{value.rank}/5</span>
                          </div>
                        )
                      }
                      if (typeof value === "number") {
                        return (
                          <div key={key}>
                            <span className="text-white/60 capitalize">{key}:</span>
                            <span className="text-white ml-2">{value}/5</span>
                          </div>
                        )
                      }
                      return null
                    }
                  )}
                </div>
              </div>
            )}

            {/* Training & Health */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Training & Health</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Physiotherapy:</span>
                  <span className="text-white ml-2">
                    {questionnaire.seeingPhysiotherapy ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="text-white/60">Weight Training:</span>
                  <span className="text-white ml-2">
                    {questionnaire.weightTrains ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="text-white/60">Stretches:</span>
                  <span className="text-white ml-2">
                    {questionnaire.stretches ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              {questionnaire.currentInjuries && (
                <div className="mt-3">
                  <span className="text-white/60 block mb-1">Current Injuries:</span>
                  <p className="text-white">{questionnaire.currentInjuries}</p>
                </div>
              )}
            </div>

            {/* Team & Competition */}
            {(questionnaire.currentTeam ||
              questionnaire.outsideSchoolTeams ||
              questionnaire.inSeason !== undefined) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Team & Competition</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {questionnaire.currentTeam && (
                    <div>
                      <span className="text-white/60">Current Team:</span>
                      <span className="text-white ml-2">{questionnaire.currentTeam}</span>
                    </div>
                  )}
                  {questionnaire.outsideSchoolTeams && (
                    <div>
                      <span className="text-white/60">Outside School Teams:</span>
                      <span className="text-white ml-2">{questionnaire.outsideSchoolTeams}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-white/60">In Season:</span>
                    <span className="text-white ml-2">
                      {questionnaire.inSeason ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Equipment & Availability */}
            {(questionnaire.equipmentAccess ||
              questionnaire.trainingDays ||
              questionnaire.averageSessionLength) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Equipment & Availability</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {questionnaire.equipmentAccess && (
                    <div>
                      <span className="text-white/60">Equipment Access:</span>
                      <span className="text-white ml-2">{questionnaire.equipmentAccess}</span>
                    </div>
                  )}
                  {questionnaire.averageSessionLength && (
                    <div>
                      <span className="text-white/60">Session Length:</span>
                      <span className="text-white ml-2">{questionnaire.averageSessionLength} min</span>
                    </div>
                  )}
                </div>
                {questionnaire.trainingDays &&
                  Array.isArray(questionnaire.trainingDays) &&
                  questionnaire.trainingDays.length > 0 && (
                    <div className="mt-3">
                      <span className="text-white/60 block mb-1">Training Days:</span>
                      <div className="flex flex-wrap gap-2">
                        {questionnaire.trainingDays.map((day: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 text-white rounded text-xs"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Mental & Coaching */}
            {(questionnaire.biggestStruggle ||
              questionnaire.confidenceLevel ||
              questionnaire.mentalChallenge ||
              questionnaire.coachability ||
              questionnaire.preferredCoachingStyle) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Mental & Coaching</h3>
                <div className="space-y-3 text-sm">
                  {questionnaire.biggestStruggle && (
                    <div>
                      <span className="text-white/60 block mb-1">Biggest Struggle:</span>
                      <p className="text-white">{questionnaire.biggestStruggle}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {questionnaire.confidenceLevel && (
                      <div>
                        <span className="text-white/60">Confidence Level:</span>
                        <span className="text-white ml-2">{questionnaire.confidenceLevel}/5</span>
                      </div>
                    )}
                    {questionnaire.coachability && (
                      <div>
                        <span className="text-white/60">Coachability:</span>
                        <span className="text-white ml-2">{questionnaire.coachability}/5</span>
                      </div>
                    )}
                  </div>
                  {questionnaire.mentalChallenge && (
                    <div>
                      <span className="text-white/60">Mental Challenge:</span>
                      <span className="text-white ml-2 capitalize">
                        {questionnaire.mentalChallenge}
                        {questionnaire.mentalChallengeOther && ` - ${questionnaire.mentalChallengeOther}`}
                      </span>
                    </div>
                  )}
                  {questionnaire.preferredCoachingStyle && (
                    <div>
                      <span className="text-white/60">Preferred Coaching Style:</span>
                      <span className="text-white ml-2 capitalize">
                        {questionnaire.preferredCoachingStyle}
                        {questionnaire.coachingStyleOther && ` - ${questionnaire.coachingStyleOther}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Videos */}
            {(questionnaire.gameFilmUrl ||
              (questionnaire.workoutVideos &&
                Array.isArray(questionnaire.workoutVideos) &&
                questionnaire.workoutVideos.length > 0)) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Videos</h3>
                {questionnaire.gameFilmUrl && (
                  <div className="mb-3">
                    <span className="text-white/60 block mb-2">Game Film:</span>
                    <a
                      href={questionnaire.gameFilmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline break-all"
                    >
                      {questionnaire.gameFilmUrl}
                    </a>
                  </div>
                )}
                {questionnaire.workoutVideos &&
                  Array.isArray(questionnaire.workoutVideos) &&
                  questionnaire.workoutVideos.length > 0 && (
                    <div>
                      <span className="text-white/60 block mb-2">Workout Videos:</span>
                      <div className="space-y-2">
                        {questionnaire.workoutVideos.map((url: string, index: number) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:text-blue-300 underline break-all"
                          >
                            Video {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {questionnaire.completedAt && (
              <div className="pt-4 border-t border-white/10 text-xs text-white/60">
                Completed: {format(new Date(questionnaire.completedAt), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <p className="text-white/60">Questionnaire not completed yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

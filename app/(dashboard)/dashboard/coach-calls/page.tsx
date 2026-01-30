import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserTier } from "@/lib/db/queries"
import { db } from "@/lib/db"
import { coachCalls } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Calendar, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default async function CoachCallsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  // Verify user is Pro+
  const tier = await getUserTier(session.user.id)
  if (tier !== "pro_plus") {
    redirect("/dashboard")
  }

  // Get user's coach calls
  const calls = await db
    .select()
    .from(coachCalls)
    .where(eq(coachCalls.userId, session.user.id))
    .orderBy(desc(coachCalls.scheduledAt))

  const upcomingCalls = calls.filter((call) => {
    const callDate = new Date(call.scheduledAt)
    return callDate > new Date() && call.status === "scheduled"
  })

  const pastCalls = calls.filter((call) => {
    const callDate = new Date(call.scheduledAt)
    return callDate <= new Date() || call.status !== "scheduled"
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">Coach Calls</h1>
          <p className="text-white/60 -mt-1">Schedule and manage your one-on-one coaching sessions</p>
        </div>
        <Link href="/onboarding/book-call">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Book New Call
          </Button>
        </Link>
      </div>

      {/* Upcoming Calls */}
      {upcomingCalls.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Calls</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingCalls.map((call) => (
              <Card key={call.id} className="border border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Coach Call</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(call.scheduledAt), "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(call.scheduledAt), "h:mm a")} ({call.duration} min)</span>
                  </div>
                  {call.googleMeetLink && (
                    <div className="pt-2">
                      <a
                        href={call.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
                      >
                        <Video className="h-4 w-4" />
                        Join Google Meet
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Calls */}
      {pastCalls.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Past Calls</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pastCalls.map((call) => (
              <Card key={call.id} className="border border-white/10 bg-white/5 backdrop-blur-sm opacity-75">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    Coach Call
                    {call.status === "completed" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(call.scheduledAt), "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(call.scheduledAt), "h:mm a")}</span>
                  </div>
                  <div className="text-sm text-white/60">
                    Status: <span className="capitalize">{call.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {upcomingCalls.length === 0 && pastCalls.length === 0 && (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-white/60" />
              </div>
              <div>
                <h3 className="text-2xl font-crimson font-normal text-white mb-2">No Coach Calls Scheduled</h3>
                <p className="text-white/60">
                  Book your first coach call to discuss your personalized training program
                </p>
              </div>
              <Link href="/onboarding/book-call">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Book Your First Call
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users, userMemberships, membershipTiers, proPlusQuestionnaires, personalizedPrograms } from "@/lib/db/schema"
import { eq, and, count } from "drizzle-orm"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, FileText, Calendar } from "lucide-react"

export default async function PersonalizedProgramsPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/dashboard")
  }

  // Get Pro+ tier ID
  const proPlusTier = await db.query.membershipTiers.findFirst({
    where: (tiers, { or, eq }) => or(
      eq(tiers.slug, "pro_plus"),
      eq(tiers.slug, "pro-plus")
    ),
  })

  if (!proPlusTier) {
    // No Pro+ tier exists yet
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">
          Personalized Programs
        </h1>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <p className="text-white/60">Pro+ tier not found in database. Please set up membership tiers first.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get all Pro+ active memberships
  const proPlusMemberships = await db.query.userMemberships.findMany({
    where: and(
      eq(userMemberships.tierId, proPlusTier.id),
      eq(userMemberships.status, "active")
    ),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  // Get users with their questionnaire and program counts
  const proPlusUsers = await Promise.all(
    proPlusMemberships.map(async (membership) => {
      const userId = membership.userId
      const [questionnaire, programs] = await Promise.all([
        db.query.proPlusQuestionnaires.findFirst({
          where: eq(proPlusQuestionnaires.userId, userId),
        }),
        db.query.personalizedPrograms.findMany({
          where: eq(personalizedPrograms.userId, userId),
        }),
      ])

      return {
        user: membership.user,
        questionnaire,
        programCount: programs.length,
      }
    })
  )

  // Filter out null users and sort by name
  const validUsers = proPlusUsers
    .filter((u) => u.user)
    .sort((a, b) => (a.user?.name || "").localeCompare(b.user?.name || ""))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">
            Personalized Programs
          </h1>
          <p className="text-white/60 -mt-1">
            Manage personalized training programs for Pro+ users
          </p>
        </div>
      </div>

      {/* Users List */}
      {validUsers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {validUsers.map(({ user, questionnaire, programCount }) => {
            if (!user) return null

            return (
              <Card
                key={user.id}
                className="border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || ""}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-white/60" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{user.name || "User"}</CardTitle>
                        <p className="text-sm text-white/60">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-white/60" />
                      <span className="text-white/80">
                        {questionnaire ? "Questionnaire Complete" : "No Questionnaire"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white/60" />
                    <span className="text-white/80">{programCount} Program{programCount !== 1 ? "s" : ""}</span>
                  </div>
                  <Link href={`/dashboard/admin/personalized-programs/${user.id}`}>
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white">
                      View User
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <Users className="w-12 h-12 text-white/40 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">No Pro+ Users Yet</h3>
                <p className="text-white/60">
                  Pro+ users who have completed their questionnaire will appear here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

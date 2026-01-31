import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserTier } from "@/lib/db/queries"
import { UpgradePage } from "@/components/upgrade/upgrade-page"

export default async function UpgradePageRoute({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const params = await searchParams
  const currentTier = await getUserTier(session.user.id)
  const selectedTier = params.tier as "pro" | "pro_plus" | undefined

  // If user already has Pro or Pro+ membership, redirect to dashboard
  if (currentTier === "pro" || currentTier === "pro_plus") {
    redirect("/dashboard")
  }

  return <UpgradePage currentTier={currentTier} selectedTier={selectedTier} userId={session.user.id} />
}

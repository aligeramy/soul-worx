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

  return <UpgradePage currentTier={currentTier} selectedTier={selectedTier} userId={session.user.id} />
}

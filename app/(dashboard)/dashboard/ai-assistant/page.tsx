import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserTier } from "@/lib/db/queries"
import { AIAssistant } from "@/components/ai/ai-assistant"
import { UpgradePrompt } from "@/components/ai/upgrade-prompt"

export default async function AIAssistantPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  const userTier = await getUserTier(session.user.id)

  // Admins get full access; free tier users see upgrade prompt
  if (!isAdmin && (!userTier || userTier === "free")) {
    return <UpgradePrompt feature="AI Assistant" />
  }

  return <AIAssistant userId={session.user.id} />
}

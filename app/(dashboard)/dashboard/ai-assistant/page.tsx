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

  const userTier = await getUserTier(session.user.id)

  // If free tier, show upgrade prompt
  if (userTier === "free") {
    return <UpgradePrompt feature="AI Assistant" />
  }

  // Pro and Pro+ users can access AI Assistant
  return <AIAssistant userId={session.user.id} />
}

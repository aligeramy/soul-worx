import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingForm } from "@/components/onboarding-form"

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  // If onboarding is already complete, redirect to dashboard
  if (!session.user.needsOnboarding) {
    redirect("/dashboard")
  }

  const userImage = session.user.image || ""
  const userInitials = session.user.email?.charAt(0).toUpperCase() || "U"

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Let&apos;s personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm 
            userImage={userImage}
            userInitials={userInitials}
            userName={session.user.name || ""}
            userEmail={session.user.email || ""}
          />
        </CardContent>
      </Card>
    </div>
  )
}


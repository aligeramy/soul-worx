import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { updateProfile } from "@/app/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Let&apos;s personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
              <AvatarImage src={userImage} alt="Profile picture" />
              <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Profile picture from your OAuth provider
              </p>
              {userImage && (
                <p className="text-xs text-muted-foreground mt-1">
                  This image will be used across the app
                </p>
              )}
            </div>
          </div>

          <form action={updateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your display name"
                defaultValue={session.user.name || ""}
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                This is how others will see you in the app
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={session.user.email || ""}
                disabled
                className="w-full bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Your email cannot be changed
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


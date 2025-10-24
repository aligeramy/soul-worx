import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const userImage = session.user.image || ""
  const userInitials = session.user.email?.charAt(0).toUpperCase() || "U"

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-white/60 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm 
              userImage={userImage}
              userInitials={userInitials}
              userName={session.user.name || ""}
              userEmail={session.user.email || ""}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


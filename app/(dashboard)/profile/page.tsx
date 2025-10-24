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
    <div className=" p-4">
      <div className="max-w-2xl mx-auto space-y-6">
       

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


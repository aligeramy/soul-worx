"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { refreshSession } from "@/lib/actions/session"

export async function updateProfile(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const image = formData.get("image") as string | null

  if (!name || name.trim().length === 0) {
    throw new Error("Name is required")
  }

  // Prepare update data
  const updateData: { name: string; image?: string } = { name: name.trim() }
  
  if (image) {
    updateData.image = image
  }

  // Update user in database
  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, session.user.id))

  // Refresh the session to update needsOnboarding flag
  await refreshSession()

  revalidatePath("/dashboard")
  revalidatePath("/onboarding")
  revalidatePath("/profile")
  
  return { success: true }
}


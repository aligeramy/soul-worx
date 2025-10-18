"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function updateProfile(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string

  if (!name || name.trim().length === 0) {
    throw new Error("Name is required")
  }

  // Update user name in database
  await db
    .update(users)
    .set({ name: name.trim() })
    .where(eq(users.id, session.user.id))

  revalidatePath("/dashboard")
  redirect("/dashboard")
}


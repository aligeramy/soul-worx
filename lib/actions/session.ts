import { auth } from "@/auth"
import type { Session } from "next-auth"
import { revalidatePath } from "next/cache"

export async function getSession(): Promise<Session | null> {
  return await auth()
}

export async function getHasSession(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

export async function refreshSession() {
  // Force revalidation of all paths to refresh auth session
  revalidatePath("/", "layout")
}

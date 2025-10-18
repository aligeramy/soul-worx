import { auth } from "@/auth"
import type { Session } from "next-auth"

export async function getSession(): Promise<Session | null> {
  return await auth()
}

export async function getHasSession(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { updateProgram } from "@/lib/db/queries"
import type { ProgramStatus } from "@/lib/db/schema"

export async function setProgramStatus(programId: string, status: ProgramStatus) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    throw new Error("Unauthorized")
  }
  if (!["draft", "published", "archived"].includes(status)) {
    throw new Error("Invalid status")
  }
  await updateProgram(programId, { status })
  revalidatePath("/dashboard/admin/programs")
  revalidatePath("/programs")
}

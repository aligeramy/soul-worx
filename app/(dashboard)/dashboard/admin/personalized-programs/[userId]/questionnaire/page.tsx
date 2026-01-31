import { redirect } from "next/navigation"

export default async function QuestionnaireRedirect({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  redirect(`/dashboard/admin/personalized-programs/${userId}`)
}

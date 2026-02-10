import { BookCoachCall } from "@/components/onboarding/book-coach-call"

/** Showcase: book coach call (no auth required) */
export default function BookCoachCallPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="w-full max-w-4xl">
        <BookCoachCall userId="showcase" />
      </div>
    </div>
  )
}

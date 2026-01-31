import { Suspense } from "react"
import { SoulworxLoginForm } from "@/components/auth/soulworx-login-form"
import { AuthSlideshow } from "@/components/auth/auth-slideshow"
import Link from "next/link"

// Background images and their corresponding quotes
const backgrounds = [
  {
    image: "/auth/1.jpg",
    quote: "Words that Walk Through Souls",
    subtext: "Unveil the Poetry of Life with Soulworx"
  },
  {
    image: "/auth/2.jpg",
    quote: "Where Poetry Meets Purpose",
    subtext: "Discover the art of creative expression"
  },
  {
    image: "/auth/3.jpg",
    quote: "Stories That Transform Lives",
    subtext: "Join a community of passionate writers"
  }
]

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium text-sm hover:opacity-80 transition-opacity">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
              </div>
            }>
              <SoulworxLoginForm />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Right Side - Background Slideshow */}
      <div className="relative hidden lg:block">
        <AuthSlideshow backgrounds={backgrounds} />
      </div>
    </div>
  )
}


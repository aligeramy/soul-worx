"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"

export default function RefreshSessionPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "refreshing" | "success" | "error">("idle")

  const refreshSession = useCallback(async () => {
    setStatus("refreshing")
    try {
      // Trigger session update
      await update()
      setStatus("success")

      // Wait a moment then redirect
      setTimeout(() => {
        router.push("/dashboard/admin")
      }, 2000)
    } catch (error) {
      console.error("Failed to refresh session:", error)
      setStatus("error")
    }
  }, [update, router])

  useEffect(() => {
    // Auto-refresh on mount
    if (session && status === "idle") {
      refreshSession()
    }
  }, [session, status, refreshSession])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-black rounded-2xl mx-auto flex items-center justify-center">
          {status === "refreshing" && (
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {status === "success" && (
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {status === "error" && (
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">
            {status === "idle" && "Preparing..."}
            {status === "refreshing" && "Refreshing Session"}
            {status === "success" && "Success!"}
            {status === "error" && "Error"}
          </h1>
          <p className="text-neutral-600">
            {status === "idle" && "Getting ready to refresh your session..."}
            {status === "refreshing" && "Updating your admin permissions..."}
            {status === "success" && "Redirecting to admin panel..."}
            {status === "error" && "Failed to refresh session. Please try signing out and back in."}
          </p>
        </div>

        {session && (
          <div className="bg-neutral-50 rounded-lg p-4 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-600">Email:</span>
              <span className="font-medium">{session.user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Current Role:</span>
              <span className="font-medium">{session.user?.role || "loading..."}</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <button
            onClick={refreshSession}
            className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
          >
            Try Again
          </button>
        )}

        <Link
          href="/api/auth/signout"
          className="block text-sm text-neutral-600 hover:text-black transition-colors"
        >
          Or sign out and sign back in
        </Link>
      </div>
    </div>
  )
}


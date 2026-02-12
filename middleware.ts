import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // Add pathname to headers for server components to access
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-pathname", pathname)

  // Always allow public routes - don't block even if session is expired/invalid
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/programs") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/shop") ||
    pathname.startsWith("/stories") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/api/auth")

  // If it's a public route, always allow access regardless of auth state
  if (isPublicRoute) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // For protected routes, let the authorized callback handle it
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}


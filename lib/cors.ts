import { NextResponse } from "next/server"

const ALLOWED_ORIGINS = [
  "https://beta.soulworx.ca",
  "http://localhost:3000",
  "exp://localhost:8081",
  "exp://192.168.*",
  /^exp:\/\/.*$/,
]

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  
  return ALLOWED_ORIGINS.some((allowed) => {
    if (typeof allowed === "string") {
      return origin === allowed || origin.startsWith(allowed.replace("*", ""))
    }
    if (allowed instanceof RegExp) {
      return allowed.test(origin)
    }
    return false
  })
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  origin: string | null
): NextResponse {
  const headers = new Headers(response.headers)
  
  if (origin && isOriginAllowed(origin)) {
    headers.set("Access-Control-Allow-Origin", origin)
    headers.set("Access-Control-Allow-Credentials", "true")
  }
  
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  )
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  )
  headers.set("Access-Control-Max-Age", "86400")
  
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Handle OPTIONS preflight request
 */
export function handleOptions(origin: string | null): NextResponse {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, origin)
}

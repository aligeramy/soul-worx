import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { put } from "@vercel/blob"
import { addCorsHeaders, handleOptions } from "@/lib/cors"

/**
 * OPTIONS /api/profile/upload-video
 * Handle CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin")
  return handleOptions(origin)
}

/**
 * POST /api/profile/upload-video
 * Upload video file to Vercel Blob Storage
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  try {
    const session = await auth()
    
    if (!session?.user) {
      return addCorsHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        origin
      )
    }

    const formData = await request.formData()
    const fileEntry = formData.get("file") as File | null
    
    if (!fileEntry || !(fileEntry instanceof File)) {
      return addCorsHeaders(
        NextResponse.json({ error: "No file provided" }, { status: 400 }),
        origin
      )
    }
    
    const file = fileEntry

    // Validate file type
    if (!file.type.startsWith("video/")) {
      return addCorsHeaders(
        NextResponse.json({ error: "File must be a video" }, { status: 400 }),
        origin
      )
    }

    // Validate file size (max 500MB for videos)
    if (file.size > 500 * 1024 * 1024) {
      return addCorsHeaders(
        NextResponse.json({ error: "File size must be less than 500MB" }, { status: 400 }),
        origin
      )
    }

    // Upload to Vercel Blob
    const blob = await put(`videos/${session.user.id}-${Date.now()}.${file.type.split("/")[1]}`, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return addCorsHeaders(
      NextResponse.json({ url: blob.url }),
      origin
    )
  } catch (error) {
    console.error("Error uploading video:", error)
    return addCorsHeaders(
      NextResponse.json({ error: "Failed to upload video" }, { status: 500 }),
      origin
    )
  }
}

import "dotenv/config"
import { readFileSync } from "fs"
import { join } from "path"
import { put } from "@vercel/blob"
import { db } from "@/lib/db"
import { communityChannels } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is not set in .env")
}

async function uploadToBlob(filePath: string, blobPath: string): Promise<string> {
  const fileBuffer = readFileSync(filePath)
  const file = new File([fileBuffer], blobPath.split("/").pop() || "file.png", { type: "image/png" })
  
  const blob = await put(blobPath, file, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true, // Allow overwriting existing blob
  })
  
  return blob.url
}

async function main() {
  const channelSlug = "two-ball-dribbling-mastery"
  const imagePath = join(process.cwd(), "vids", "cover-art", "3.2-compressed.png")
  
  console.log(`🖼️  Uploading compressed cover art for ${channelSlug}...`)
  
  // Upload to Vercel Blob
  const blobPath = `cover-arts/${channelSlug}.png`
  const coverImageUrl = await uploadToBlob(imagePath, blobPath)
  console.log(`✓ Uploaded to: ${coverImageUrl}`)
  
  // Update database
  console.log(`💾 Updating database...`)
  await db.update(communityChannels)
    .set({ 
      coverImage: coverImageUrl,
      updatedAt: new Date(),
    })
    .where(eq(communityChannels.slug, channelSlug))
  
  console.log(`✓ Channel cover art updated successfully!`)
}

main().catch(console.error)

import "dotenv/config"
import { del } from "@vercel/blob"
import { db } from "@/lib/db"
import { communityChannels, videos } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is not set in .env")
}

async function main() {
  console.log("🗑️  Starting deletion process...\n")

  // Get all videos with blob URLs
  console.log("📹 Fetching videos from database...")
  const allVideos = await db.select({
    id: videos.id,
    videoUrl: videos.videoUrl,
    thumbnailUrl: videos.thumbnailUrl,
    title: videos.title,
  }).from(videos)

  console.log(`Found ${allVideos.length} videos\n`)

  // Delete videos from Vercel Blob
  const blobUrls: string[] = []
  
  for (const video of allVideos) {
    if (video.videoUrl && video.videoUrl.includes("blob.vercel-storage.com")) {
      blobUrls.push(video.videoUrl)
    }
    if (video.thumbnailUrl && video.thumbnailUrl.includes("blob.vercel-storage.com")) {
      blobUrls.push(video.thumbnailUrl)
    }
  }

  console.log(`📦 Found ${blobUrls.length} blob URLs to delete\n`)

  if (blobUrls.length > 0) {
    console.log("🗑️  Deleting videos from Vercel Blob...")
    let deletedCount = 0
    let failedCount = 0

    for (const url of blobUrls) {
      try {
        await del(url)
        deletedCount++
        if (deletedCount % 10 === 0) {
          console.log(`  Deleted ${deletedCount}/${blobUrls.length} files...`)
        }
      } catch (error) {
        failedCount++
        console.error(`  ✗ Failed to delete ${url}:`, error)
      }
    }

    console.log(`\n✓ Deleted ${deletedCount} files from Vercel Blob`)
    if (failedCount > 0) {
      console.log(`  ⚠️  ${failedCount} files failed to delete`)
    }
  }

  // Delete channels (this will cascade delete videos)
  console.log("\n🗑️  Deleting channels from database...")
  const channels = await db.select({
    id: communityChannels.id,
    slug: communityChannels.slug,
    title: communityChannels.title,
  }).from(communityChannels)

  console.log(`Found ${channels.length} channels to delete\n`)

  for (const channel of channels) {
    try {
      await db.delete(communityChannels).where(eq(communityChannels.id, channel.id))
      console.log(`  ✓ Deleted channel: ${channel.title} (${channel.slug})`)
    } catch (error) {
      console.error(`  ✗ Failed to delete channel ${channel.slug}:`, error)
    }
  }

  console.log("\n✨ Deletion process complete!")
  console.log(`\n📊 Summary:`)
  console.log(`  - Deleted ${blobUrls.length} files from Vercel Blob`)
  console.log(`  - Deleted ${channels.length} channels from database`)
  console.log(`  - Videos were automatically deleted via cascade`)
}

main().catch(console.error)

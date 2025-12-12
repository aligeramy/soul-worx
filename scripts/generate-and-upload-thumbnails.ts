import "dotenv/config"
import { put } from "@vercel/blob"
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import { readdir } from "fs/promises"
import { execSync } from "child_process"

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is not set in .env")
}

interface Video {
  title: string
  slug: string
  videoUrl: string
  thumbnailUrl: string
  episodeNumber: number
  seasonNumber: number
}

interface Channel {
  channel: {
    title: string
    slug: string
  }
  videos: Video[]
}

interface ChannelsData {
  channels: Channel[]
}

// Check if ffmpeg is available
function checkFFmpeg(): boolean {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" })
    return true
  } catch {
    return false
  }
}

// Generate thumbnail from video using ffmpeg
async function generateThumbnail(videoPath: string, outputPath: string): Promise<void> {
  try {
    // Extract frame at 1 second (or middle if video is shorter)
    execSync(
      `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${outputPath}"`,
      { stdio: "ignore" }
    )
  } catch (error) {
    console.error(`Failed to generate thumbnail for ${videoPath}:`, error)
    throw error
  }
}

// Upload thumbnail to Vercel Blob
async function uploadThumbnailToBlob(filePath: string, fileName: string): Promise<string> {
  console.log(`Uploading thumbnail ${fileName}...`)
  
  const fileBuffer = readFileSync(filePath)
  const file = new File([fileBuffer], fileName, { type: "image/jpeg" })
  
  const blob = await put(`thumbnails/${fileName}`, file, {
    access: "public",
    addRandomSuffix: false,
  })
  
  console.log(`✓ Uploaded: ${blob.url}`)
  return blob.url
}

// Get video files from directory
async function getVideoFiles(dir: string): Promise<string[]> {
  const files = await readdir(dir, { withFileTypes: true })
  const videoFiles: string[] = []
  
  for (const file of files) {
    if (file.isFile() && file.name.match(/\.(mp4|mov|webm)$/i)) {
      videoFiles.push(join(dir, file.name))
    }
  }
  
  return videoFiles.sort()
}

async function main() {
  console.log("🎬 Starting thumbnail generation and upload process...\n")
  
  // Check if ffmpeg is available
  if (!checkFFmpeg()) {
    console.error("❌ Error: ffmpeg is not installed or not in PATH")
    console.log("Please install ffmpeg:")
    console.log("  macOS: brew install ffmpeg")
    console.log("  Ubuntu/Debian: sudo apt-get install ffmpeg")
    console.log("  Windows: Download from https://ffmpeg.org/download.html")
    process.exit(1)
  }
  
  // Read the JSON file
  const jsonPath = join(process.cwd(), "data", "new-channels.json")
  const jsonData: ChannelsData = JSON.parse(readFileSync(jsonPath, "utf-8"))
  
  // Create temp directory for thumbnails
  const tempDir = join(process.cwd(), "temp-thumbnails")
  if (!existsSync(tempDir)) {
    execSync(`mkdir -p "${tempDir}"`)
  }
  
  // Get video files
  const ballHandlingDir = join(process.cwd(), "public", "upload", "ball-handling-compressed")
  const shootingDir = join(process.cwd(), "public", "upload", "shooting-on-court-compressed")
  
  const ballHandlingVideos = await getVideoFiles(ballHandlingDir)
  const shootingVideos = await getVideoFiles(shootingDir)
  
  console.log(`Found ${ballHandlingVideos.length} ball handling videos`)
  console.log(`Found ${shootingVideos.length} shooting videos\n`)
  
  // Process ball handling videos
  const ballHandlingChannel = jsonData.channels[0]
  console.log(`\n📹 Processing Ball Handling videos (${ballHandlingChannel.videos.length} episodes)...`)
  
  for (let i = 0; i < ballHandlingChannel.videos.length && i < ballHandlingVideos.length; i++) {
    const video = ballHandlingChannel.videos[i]
    const videoPath = ballHandlingVideos[i]
    const videoFileName = `ball-handling-s1e${video.episodeNumber}.mp4`
    const thumbnailFileName = `ball-handling-s1e${video.episodeNumber}.jpg`
    const tempThumbnailPath = join(tempDir, thumbnailFileName)
    
    try {
      // Generate thumbnail
      console.log(`  Generating thumbnail for episode ${video.episodeNumber}...`)
      await generateThumbnail(videoPath, tempThumbnailPath)
      
      // Upload to blob
      const thumbnailUrl = await uploadThumbnailToBlob(tempThumbnailPath, thumbnailFileName)
      video.thumbnailUrl = thumbnailUrl
      
      console.log(`  ✓ Episode ${video.episodeNumber}: ${video.title}`)
    } catch (error) {
      console.error(`  ✗ Failed to process episode ${video.episodeNumber}:`, error)
    }
  }
  
  // Process shooting videos
  const shootingChannel = jsonData.channels[1]
  console.log(`\n🏀 Processing Shooting videos (${shootingChannel.videos.length} episodes)...`)
  
  for (let i = 0; i < shootingChannel.videos.length && i < shootingVideos.length; i++) {
    const video = shootingChannel.videos[i]
    const videoPath = shootingVideos[i]
    const videoFileName = `shooting-on-court-s1e${video.episodeNumber}.mp4`
    const thumbnailFileName = `shooting-on-court-s1e${video.episodeNumber}.jpg`
    const tempThumbnailPath = join(tempDir, thumbnailFileName)
    
    try {
      // Generate thumbnail
      console.log(`  Generating thumbnail for episode ${video.episodeNumber}...`)
      await generateThumbnail(videoPath, tempThumbnailPath)
      
      // Upload to blob
      const thumbnailUrl = await uploadThumbnailToBlob(tempThumbnailPath, thumbnailFileName)
      video.thumbnailUrl = thumbnailUrl
      
      console.log(`  ✓ Episode ${video.episodeNumber}: ${video.title}`)
    } catch (error) {
      console.error(`  ✗ Failed to process episode ${video.episodeNumber}:`, error)
    }
  }
  
  // Save updated JSON
  console.log("\n💾 Saving updated JSON file...")
  writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf-8")
  console.log("✓ JSON file updated successfully!")
  
  // Clean up temp directory
  console.log("\n🧹 Cleaning up temporary files...")
  execSync(`rm -rf "${tempDir}"`)
  console.log("✓ Cleanup complete!")
  
  console.log("\n✨ Thumbnail generation and upload process complete!")
  console.log("\n📊 Summary:")
  console.log(`  Ball Handling: ${ballHandlingChannel.videos.filter(v => v.thumbnailUrl).length}/${ballHandlingChannel.videos.length} thumbnails uploaded`)
  console.log(`  Shooting: ${shootingChannel.videos.filter(v => v.thumbnailUrl).length}/${shootingChannel.videos.length} thumbnails uploaded`)
  console.log("\n💡 Next step: Update videos in Supabase using the updated JSON file")
}

main().catch(console.error)


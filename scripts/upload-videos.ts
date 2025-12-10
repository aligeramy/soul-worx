import "dotenv/config"
import { put } from "@vercel/blob"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { readdir } from "fs/promises"

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is not set in .env")
}

interface Video {
  title: string
  slug: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  duration: number | null
  episodeNumber: number
  seasonNumber: number
  isFirstEpisode: boolean
  requiredTierLevel: number
  status: string
  tags: string[]
  metaTitle: string
  metaDescription: string
}

interface Channel {
  channel: {
    title: string
    slug: string
    description: string
    longDescription: string
    category: string
    status: string
    coverImage: string
    thumbnailImage: string
    requiredTierLevel: number
    isFeatured: boolean
    tags: string[]
    metaTitle: string
    metaDescription: string
    sortOrder: number
  }
  videos: Video[]
}

interface ChannelsData {
  channels: Channel[]
}

async function uploadVideoToBlob(filePath: string, fileName: string): Promise<string> {
  console.log(`Uploading ${fileName}...`)
  
  const fileBuffer = readFileSync(filePath)
  const file = new File([fileBuffer], fileName, { type: "video/mp4" })
  
  const blob = await put(`videos/${fileName}`, file, {
    access: "public",
    addRandomSuffix: false,
  })
  
  console.log(`✓ Uploaded: ${blob.url}`)
  return blob.url
}

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
  console.log("🎬 Starting video upload process...\n")
  
  // Read the JSON file
  const jsonPath = join(process.cwd(), "data", "new-channels.json")
  const jsonData: ChannelsData = JSON.parse(readFileSync(jsonPath, "utf-8"))
  
  // Get video files
  const ballHandlingDir = join(process.cwd(), "public", "upload", "ball-handling-compressed")
  const shootingDir = join(process.cwd(), "public", "upload", "shooting-on-court-compressed")
  
  const ballHandlingVideos = await getVideoFiles(ballHandlingDir)
  const shootingVideos = await getVideoFiles(shootingDir)
  
  console.log(`Found ${ballHandlingVideos.length} ball handling videos`)
  console.log(`Found ${shootingVideos.length} shooting videos\n`)
  
  // Upload ball handling videos and match to episodes
  const ballHandlingChannel = jsonData.channels[0]
  console.log(`\n📹 Uploading Ball Handling videos (${ballHandlingChannel.videos.length} episodes)...`)
  
  for (let i = 0; i < ballHandlingChannel.videos.length && i < ballHandlingVideos.length; i++) {
    const video = ballHandlingChannel.videos[i]
    const videoPath = ballHandlingVideos[i]
    const fileName = `ball-handling-s1e${video.episodeNumber}.mp4`
    
    try {
      const videoUrl = await uploadVideoToBlob(videoPath, fileName)
      video.videoUrl = videoUrl
      console.log(`  Episode ${video.episodeNumber}: ${video.title} → ${videoUrl}`)
    } catch (error) {
      console.error(`  ✗ Failed to upload episode ${video.episodeNumber}:`, error)
    }
  }
  
  // Upload shooting videos and match to episodes
  const shootingChannel = jsonData.channels[1]
  console.log(`\n🏀 Uploading Shooting videos (${shootingChannel.videos.length} episodes)...`)
  
  for (let i = 0; i < shootingChannel.videos.length && i < shootingVideos.length; i++) {
    const video = shootingChannel.videos[i]
    const videoPath = shootingVideos[i]
    const fileName = `shooting-on-court-s1e${video.episodeNumber}.mp4`
    
    try {
      const videoUrl = await uploadVideoToBlob(videoPath, fileName)
      video.videoUrl = videoUrl
      console.log(`  Episode ${video.episodeNumber}: ${video.title} → ${videoUrl}`)
    } catch (error) {
      console.error(`  ✗ Failed to upload episode ${video.episodeNumber}:`, error)
    }
  }
  
  // Save updated JSON
  console.log("\n💾 Saving updated JSON file...")
  writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf-8")
  console.log("✓ JSON file updated successfully!")
  
  console.log("\n✨ Video upload process complete!")
  console.log("\n📊 Summary:")
  console.log(`  Ball Handling: ${ballHandlingChannel.videos.filter(v => v.videoUrl).length}/${ballHandlingChannel.videos.length} videos uploaded`)
  console.log(`  Shooting: ${shootingChannel.videos.filter(v => v.videoUrl).length}/${shootingChannel.videos.length} videos uploaded`)
}

main().catch(console.error)

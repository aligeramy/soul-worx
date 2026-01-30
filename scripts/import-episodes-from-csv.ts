import "dotenv/config"
import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { execSync } from "child_process"
import { put } from "@vercel/blob"
import { db } from "@/lib/db"
import { communityChannels, channelSections, videos, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is not set in .env")
}

interface EpisodeRow {
  "Channel Name": string
  "Channel Slug": string
  "Channel Description": string
  "Channel Category": string
  "Section Name": string
  "Section Slug": string
  "Section Order": string
  "Episode Number": string
  "Episode Title": string
  "Episode Slug": string
  "Episode Description": string
  "Episode Level": string
  "Difficulty Level": string
  "File Name": string
  "Upload Status": string
  "Video URL": string
  "Thumbnail URL": string
  "Required Tier Level": string
  "Is First Episode": string
  "Status": string
  "Season Number": string
  "Tags": string
  "Notes": string
}

interface ChannelData {
  name: string
  slug: string
  description: string
  category: string
  coverArtPath: string
  coverArtUrl?: string
  sections: Map<string, SectionData>
  episodes: EpisodeRow[]
}

interface SectionData {
  name: string
  slug: string
  order: number
  channelSlug: string
}

// Parse CSV with proper quote handling
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
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

// Generate thumbnail from video
async function generateThumbnail(videoPath: string, outputPath: string): Promise<string | null> {
  try {
    // Try multiple timestamps in case video is short
    const timestamps = ["00:00:01", "00:00:02", "00:00:00.5"]
    
    for (const timestamp of timestamps) {
      try {
        execSync(
          `ffmpeg -i "${videoPath}" -ss ${timestamp} -vframes 1 -q:v 2 "${outputPath}"`,
          { stdio: "ignore" }
        )
        return outputPath
      } catch {
        continue
      }
    }
    
    // If all timestamps fail, try without timestamp (first frame)
    execSync(
      `ffmpeg -i "${videoPath}" -vframes 1 -q:v 2 "${outputPath}"`,
      { stdio: "ignore" }
    )
    return outputPath
  } catch (error) {
    console.error(`  ⚠️  Failed to generate thumbnail for ${videoPath}`)
    return null
  }
}

// Upload file to Vercel Blob
async function uploadToBlob(filePath: string, blobPath: string): Promise<string> {
  const fileBuffer = readFileSync(filePath)
  const fileName = blobPath.split("/").pop() || "file"
  const fileExtension = fileName.split(".").pop() || ""
  
  let mimeType = "application/octet-stream"
  if (fileExtension === "mp4") mimeType = "video/mp4"
  if (fileExtension === "png") mimeType = "image/png"
  if (fileExtension === "jpg" || fileExtension === "jpeg") mimeType = "image/jpeg"
  
  const file = new File([fileBuffer], fileName, { type: mimeType })
  
  const blob = await put(blobPath, file, {
    access: "public",
    addRandomSuffix: false,
  })
  
  return blob.url
}

// Get admin user ID
async function getAdminUserId(): Promise<string> {
  const adminUser = await db.query.users.findFirst({
    where: (users, { inArray }) => inArray(users.role, ["admin", "super_admin"]),
  })
  
  if (!adminUser) {
    throw new Error("No admin user found. Please create an admin user first.")
  }
  
  return adminUser.id
}

async function main() {
  console.log("🚀 Starting episode import process...\n")

  // Check ffmpeg
  if (!checkFFmpeg()) {
    console.error("❌ Error: ffmpeg is not installed")
    console.log("Please install: brew install ffmpeg")
    process.exit(1)
  }

  // Parse CSV
  console.log("📝 Parsing CSV...")
  const csvPath = join(process.cwd(), "data", "episodes-database-structure.csv")
  const csvContent = readFileSync(csvPath, "utf-8")
  const lines = csvContent.split("\n").filter(line => line.trim())
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, ""))
  
  const records: EpisodeRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const record: any = {}
    headers.forEach((header, index) => {
      const value = values[index]?.replace(/^"|"$/g, "") || ""
      record[header] = value
    })
    if (record["Channel Name"] && record["Channel Name"].trim()) {
      records.push(record as EpisodeRow)
    }
  }

  console.log(`✓ Parsed ${records.length} episodes\n`)

  // Group by channel
  const channels = new Map<string, ChannelData>()
  
  for (const record of records) {
    const channelSlug = record["Channel Slug"]
    
    if (!channels.has(channelSlug)) {
      // Determine cover art number based on channel order
      const channelOrder = Array.from(channels.keys()).length + 1
      const coverArtPath = join(process.cwd(), "vids", "cover-art", `${channelOrder}.png`)
      
      channels.set(channelSlug, {
        name: record["Channel Name"],
        slug: channelSlug,
        description: record["Channel Description"],
        category: record["Channel Category"],
        coverArtPath,
        sections: new Map(),
        episodes: [],
      })
    }
    
    const channel = channels.get(channelSlug)!
    
    // Add section if not exists
    const sectionSlug = record["Section Slug"]
    if (!channel.sections.has(sectionSlug)) {
      channel.sections.set(sectionSlug, {
        name: record["Section Name"],
        slug: sectionSlug,
        order: parseInt(record["Section Order"]) || 0,
        channelSlug,
      })
    }
    
    // Add episode
    channel.episodes.push(record)
  }

  console.log(`📊 Found ${channels.size} channels:\n`)
  channels.forEach((channel, slug) => {
    console.log(`  ${channel.name} (${slug})`)
    console.log(`    - ${channel.sections.size} sections`)
    console.log(`    - ${channel.episodes.length} episodes`)
  })

  // Get admin user ID
  console.log("\n👤 Getting admin user...")
  const adminUserId = await getAdminUserId()
  console.log(`✓ Admin user ID: ${adminUserId}\n`)

  // Create temp directory for thumbnails
  const tempDir = join(process.cwd(), "temp-thumbnails")
  if (!existsSync(tempDir)) {
    execSync(`mkdir -p "${tempDir}"`)
  }

  const channelIds = new Map<string, string>()
  const sectionIds = new Map<string, string>()

  // Process each channel
  for (const [channelSlug, channelData] of channels) {
    console.log(`\n📺 Processing channel: ${channelData.name}`)
    
    // Check if channel already exists
    const existingChannel = await db.query.communityChannels.findFirst({
      where: (channels, { eq }) => eq(channels.slug, channelSlug),
    })
    
    let channelId: string
    let coverArtUrl = ""
    
    if (existingChannel) {
      console.log(`  ℹ️  Channel already exists, skipping creation`)
      channelId = existingChannel.id
      coverArtUrl = existingChannel.coverImage || ""
    } else {
      // Upload cover art
      console.log(`  📷 Uploading cover art...`)
      if (existsSync(channelData.coverArtPath)) {
        try {
          coverArtUrl = await uploadToBlob(
            channelData.coverArtPath,
            `cover-arts/${channelSlug}.png`
          )
          console.log(`  ✓ Cover art uploaded: ${coverArtUrl}`)
        } catch (error: any) {
          if (error.message?.includes("already exists")) {
            console.log(`  ℹ️  Cover art already exists, skipping upload`)
            // Try to get existing URL - we'll use placeholder for now
            coverArtUrl = `cover-arts/${channelSlug}.png`
          } else {
            throw error
          }
        }
      } else {
        console.log(`  ⚠️  Cover art not found: ${channelData.coverArtPath}`)
      }

      // Create channel in database
      console.log(`  💾 Creating channel in database...`)
      const [channel] = await db.insert(communityChannels).values({
      slug: channelSlug,
      title: channelData.name,
      description: channelData.description,
      category: channelData.category as any,
      status: "published",
      coverImage: coverArtUrl || null,
      requiredTierLevel: 1,
      isFeatured: false,
      tags: [],
      videoCount: 0,
      sortOrder: 0,
      createdBy: adminUserId,
      publishedAt: new Date(),
      }).returning()
      
      channelId = channel.id
      channelIds.set(channelSlug, channelId)
      console.log(`  ✓ Channel created: ${channelId}`)
    }
    
    // Ensure channelId is set in map
    if (!channelIds.has(channelSlug)) {
      channelIds.set(channelSlug, channelId)
    }

    // Create sections (skip if exists)
    console.log(`  📑 Creating ${channelData.sections.size} sections...`)
    const sections = Array.from(channelData.sections.values()).sort((a, b) => a.order - b.order)
    
    for (const section of sections) {
      const existingSection = await db.query.channelSections.findFirst({
        where: (sections, { eq, and }) => and(
          eq(sections.channelId, channelId),
          eq(sections.slug, section.slug)
        ),
      })
      
      if (existingSection) {
        sectionIds.set(`${channelSlug}:${section.slug}`, existingSection.id)
        console.log(`    ℹ️  Section already exists: ${section.name}`)
      } else {
        const [createdSection] = await db.insert(channelSections).values({
          channelId: channelId,
          slug: section.slug,
          title: section.name,
          description: null,
          sortOrder: section.order,
        }).returning()
        
        const sectionId = createdSection.id
        sectionIds.set(`${channelSlug}:${section.slug}`, sectionId)
        console.log(`    ✓ Section created: ${section.name} (${sectionId})`)
      }
    }

    // Process episodes
    console.log(`  🎬 Processing ${channelData.episodes.length} episodes...`)
    
    for (const episode of channelData.episodes) {
      try {
        // Check if video already exists
        const existingVideo = await db.query.videos.findFirst({
          where: (videos, { eq }) => eq(videos.slug, episode["Episode Slug"]),
        })
        
        if (existingVideo) {
          console.log(`    ℹ️  Video already exists: ${episode["Episode Title"]}`)
          continue
        }
        // Find video file by episode slug (CSV File Name doesn't match actual files)
        const episodeSlug = episode["Episode Slug"]
        const episodeNumber = episode["Episode Number"].padStart(2, "0")
        const channelIndex = Array.from(channels.keys()).indexOf(channelSlug) + 1
        
        // Try different possible directory names
        let videoPath = ""
        const possibleDirs = [
          join(process.cwd(), "vids", "videos", `${channelIndex}-${channelSlug}`),
          join(process.cwd(), "vids", "videos", channelSlug),
        ]
        
        // Try matching by episode slug pattern (actual file naming)
        const possibleFileNames = [
          `${episodeNumber}-${episodeSlug}.mp4`,
          `${episodeNumber}-${episodeSlug}.mov`,
          `${episode["File Name"].trim()}`, // Fallback to CSV filename
        ]
        
        for (const dir of possibleDirs) {
          if (!existsSync(dir)) continue
          
          for (const possibleFileName of possibleFileNames) {
            const testPath = join(dir, possibleFileName)
            if (existsSync(testPath)) {
              videoPath = testPath
              break
            }
          }
          if (videoPath) break
        }
        
        if (!videoPath) {
          console.log(`    ⚠️  Video not found: ${fileName}`)
          continue
        }

        // Upload video (skip if exists)
        const videoBlobPath = `videos/${channelSlug}/${episode["Episode Slug"]}.mp4`
        console.log(`    📹 Uploading video: ${episode["Episode Title"]}...`)
        let videoUrl = ""
        try {
          videoUrl = await uploadToBlob(videoPath, videoBlobPath)
          console.log(`      ✓ Video uploaded`)
        } catch (error: any) {
          if (error.message?.includes("already exists")) {
            console.log(`      ℹ️  Video already exists in blob, using existing URL`)
            // Construct URL from blob path
            videoUrl = `https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/${videoBlobPath}`
          } else {
            throw error
          }
        }

        // Generate thumbnail (continue even if it fails)
        const thumbnailFileName = `${episode["Episode Slug"]}.jpg`
        const tempThumbnailPath = join(tempDir, thumbnailFileName)
        let thumbnailUrl = ""
        
        try {
          console.log(`    🖼️  Generating thumbnail...`)
          await generateThumbnail(videoPath, tempThumbnailPath)
          
          const thumbnailBlobPath = `thumbnails/${channelSlug}/${thumbnailFileName}`
          thumbnailUrl = await uploadToBlob(tempThumbnailPath, thumbnailBlobPath)
          console.log(`      ✓ Thumbnail uploaded`)
        } catch (error) {
          console.log(`      ⚠️  Thumbnail generation failed, continuing without thumbnail`)
          // Continue without thumbnail
        }

        // Parse tags
        const tags = episode["Tags"]
          ? episode["Tags"].split(",").map(t => t.trim()).filter(Boolean)
          : []

        // Create video record
        const sectionId = sectionIds.get(`${channelSlug}:${episode["Section Slug"]}`)
        const isFirstEpisode = episode["Is First Episode"].toLowerCase() === "true"
        const requiredTierLevel = parseInt(episode["Required Tier Level"]) || 2
        
        await db.insert(videos).values({
          channelId: channelId,
          sectionId: sectionId || null,
          slug: episode["Episode Slug"],
          title: episode["Episode Title"],
          description: episode["Episode Description"] || null,
          videoUrl: videoUrl,
          thumbnailUrl: thumbnailUrl || null,
          duration: null,
          isFirstEpisode: isFirstEpisode,
          episodeNumber: parseInt(episode["Episode Number"]) || 0,
          seasonNumber: parseInt(episode["Season Number"]) || 1,
          requiredTierLevel: requiredTierLevel,
          status: "published",
          viewCount: 0,
          tags: tags,
          createdBy: adminUserId,
          publishedAt: new Date(),
        })
        
        console.log(`    ✓ Episode created: ${episode["Episode Title"]}`)
        
      } catch (error) {
        console.error(`    ✗ Failed to process episode ${episode["Episode Title"]}:`, error)
      }
    }

    // Update channel video count
    const videoCount = channelData.episodes.length
    await db.update(communityChannels)
      .set({ 
        videoCount: videoCount,
        updatedAt: new Date(),
      })
      .where(eq(communityChannels.id, channelId))
    console.log(`  ✓ Updated video count: ${videoCount}`)
  }

  // Cleanup
  console.log("\n🧹 Cleaning up temporary files...")
  execSync(`rm -rf "${tempDir}"`)
  console.log("✓ Cleanup complete!")

  console.log("\n✨ Import complete!")
  console.log(`\n📊 Summary:`)
  channels.forEach((channel, slug) => {
    console.log(`  ${channel.name}: ${channel.episodes.length} episodes`)
  })
}

main().catch(console.error)

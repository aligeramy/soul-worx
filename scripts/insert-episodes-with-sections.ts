import "dotenv/config"
import { readFileSync } from "fs"
import { join } from "path"

// Placeholder Vercel Blob URLs - replace these later
const PLACEHOLDER_VIDEO_URLS = [
  "https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/placeholder-1.mp4",
  "https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/placeholder-2.mp4",
  "https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/placeholder-3.mp4",
]

const PLACEHOLDER_THUMBNAIL_URLS = [
  "https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/thumbnails/placeholder-1.jpg",
  "https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/thumbnails/placeholder-2.jpg",
  "https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/thumbnails/placeholder-3.jpg",
]

function getRandomVideoUrl(): string {
  return PLACEHOLDER_VIDEO_URLS[Math.floor(Math.random() * PLACEHOLDER_VIDEO_URLS.length)]
}

function getRandomThumbnailUrl(): string {
  return PLACEHOLDER_THUMBNAIL_URLS[Math.floor(Math.random() * PLACEHOLDER_THUMBNAIL_URLS.length)]
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

async function main() {
  console.log("📝 Parsing CSV and generating SQL for Supabase MCP...\n")
  
  const csvPath = join(process.cwd(), "episodes-database-structure.csv")
  const csvContent = readFileSync(csvPath, "utf-8")
  
  // Proper CSV parser that handles quoted fields with commas
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
          i++ // Skip next quote
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
    // Only add if we have a channel name
    if (record["Channel Name"] && record["Channel Name"].trim()) {
      records.push(record as EpisodeRow)
    }
  }
  
  // Group by channel and section
  const channelMap = new Map<string, {
    channel: {
      name: string
      slug: string
      description: string
      category: string
    }
    sections: Map<string, {
      name: string
      slug: string
      order: number
      episodes: EpisodeRow[]
    }>
  }>()
  
  for (const row of records) {
    const channelSlug = row["Channel Slug"]
    const sectionSlug = row["Section Slug"]
    
    if (!channelMap.has(channelSlug)) {
      channelMap.set(channelSlug, {
        channel: {
          name: row["Channel Name"],
          slug: channelSlug,
          description: row["Channel Description"],
          category: row["Channel Category"],
        },
        sections: new Map(),
      })
    }
    
    const channelData = channelMap.get(channelSlug)!
    
    if (!channelData.sections.has(sectionSlug)) {
      channelData.sections.set(sectionSlug, {
        name: row["Section Name"],
        slug: sectionSlug,
        order: parseInt(row["Section Order"]) || 0,
        episodes: [],
      })
    }
    
    channelData.sections.get(sectionSlug)!.episodes.push(row)
  }
  
  const sqlStatements: string[] = []
  const now = new Date().toISOString()
  
  // Create channels, sections, and videos
  for (const [channelSlug, channelData] of channelMap) {
    const channel = channelData.channel
    
    // Insert or update channel
    sqlStatements.push(`
-- Channel: ${channel.name}
INSERT INTO community_channel (
  id, slug, title, description, category, status,
  "requiredTierLevel", "isFeatured", tags, "videoCount",
  "metaTitle", "metaDescription", "sortOrder",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  '${channel.slug}',
  '${channel.name.replace(/'/g, "''")}',
  '${channel.description.replace(/'/g, "''")}',
  '${channel.category}',
  'published',
  1,
  false,
  '["basketball", "training"]'::jsonb,
  0,
  '${channel.name} - Online Basketball Training',
  '${channel.description.replace(/'/g, "''")}',
  0,
  (SELECT id FROM "user" WHERE role IN ('admin', 'super_admin') LIMIT 1),
  '${now}',
  '${now}',
  '${now}'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "updatedAt" = '${now}';
`)
    
    // Create sections
    const sections = Array.from(channelData.sections.values()).sort((a, b) => a.order - b.order)
    
    for (const section of sections) {
      sqlStatements.push(`
-- Section: ${section.name} (${channel.name})
INSERT INTO channel_section (
  id, "channelId", slug, title, "sortOrder", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = '${channel.slug}' LIMIT 1),
  '${section.slug}',
  '${section.name.replace(/'/g, "''")}',
  ${section.order},
  '${now}',
  '${now}'
) ON CONFLICT DO NOTHING;
`)
      
      // Insert videos for this section
      for (const episode of section.episodes) {
        const videoUrl = episode["Video URL"] || getRandomVideoUrl()
        const thumbnailUrl = episode["Thumbnail URL"] || getRandomThumbnailUrl()
        const tags = episode["Tags"] ? `'${episode["Tags"].replace(/'/g, "''")}'` : "'[]'"
        const isFirstEpisode = episode["Is First Episode"]?.toLowerCase() === "true"
        const requiredTier = parseInt(episode["Required Tier Level"]) || (isFirstEpisode ? 1 : 2)
        const episodeNumber = parseInt(episode["Episode Number"]) || null
        const seasonNumber = parseInt(episode["Season Number"]) || 1
        const status = episode["Status"] || "published"
        const episodeDesc = episode["Episode Description"] || ""
        const metaDesc = episodeDesc.length > 150 ? episodeDesc.substring(0, 147) + "..." : episodeDesc
        
        sqlStatements.push(`
-- Video: ${episode["Episode Title"]} (${channel.name} - ${section.name})
INSERT INTO video (
  id, "channelId", "sectionId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = '${channel.slug}' LIMIT 1),
  (SELECT id FROM channel_section WHERE slug = '${section.slug}' AND "channelId" = (SELECT id FROM community_channel WHERE slug = '${channel.slug}' LIMIT 1) LIMIT 1),
  '${episode["Episode Slug"]}',
  '${episode["Episode Title"].replace(/'/g, "''")}',
  '${episodeDesc.replace(/'/g, "''")}',
  '${videoUrl}',
  '${thumbnailUrl}',
  NULL,
  ${isFirstEpisode},
  ${episodeNumber ? episodeNumber : 'NULL'},
  ${seasonNumber},
  ${requiredTier},
  '${status}',
  0,
  ${tags}::jsonb,
  '${episode["Episode Title"].replace(/'/g, "''")} - ${channel.name}',
  '${metaDesc.replace(/'/g, "''")}',
  (SELECT id FROM "user" WHERE role IN ('admin', 'super_admin') LIMIT 1),
  '${now}',
  '${now}',
  ${status === 'published' ? `'${now}'` : 'NULL'}
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "sectionId" = EXCLUDED."sectionId",
  "episodeNumber" = EXCLUDED."episodeNumber",
  "updatedAt" = '${now}';
`)
      }
    }
    
    // Update video count
    sqlStatements.push(`
-- Update video count for channel: ${channel.name}
UPDATE community_channel
SET "videoCount" = (
  SELECT COUNT(*) FROM video WHERE "channelId" = (
    SELECT id FROM community_channel WHERE slug = '${channel.slug}' LIMIT 1
  )
)
WHERE slug = '${channel.slug}';
`)
  }
  
  const fullSQL = sqlStatements.join("\n")
  
  console.log("✅ Generated SQL for channels, sections, and videos")
  console.log(`📊 Channels: ${channelMap.size}`)
  console.log(`📊 Total sections: ${Array.from(channelMap.values()).reduce((sum, c) => sum + c.sections.size, 0)}`)
  console.log(`📊 Total videos: ${records.length}`)
  console.log("\n💡 Copy the SQL below and execute via Supabase MCP:")
  console.log("   Use: mcp_supabase_apply_migration with name 'add_sections_and_episodes'")
  console.log("\n" + "=".repeat(80))
  console.log(fullSQL)
  console.log("=".repeat(80))
}

main().catch(console.error)


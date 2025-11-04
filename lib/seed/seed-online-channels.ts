// Seed script for online basketball community channels and videos
// Usage: tsx lib/seed-online-channels.ts

import "dotenv/config"
import { db } from "../db/index"
import { communityChannels, videos, type ChannelCategory, type ChannelStatus, type VideoStatus } from "../db/schema"
import { sql, like } from "drizzle-orm"

// Available images from the site
const availableImages = [
  "/optimized/0K0A5232.jpg",
  "/optimized/0K0A4923.jpg",
  "/optimized/0K0A4950.jpg",
  "/optimized/0K0A5081.jpg",
  "/optimized/0K0A5119.jpg",
  "/optimized/0K0A5207.jpg",
  "/optimized/0K0A5225.jpg",
  "/optimized/0K0A5672.jpg",
  "/optimized/0K0A5675.jpg",
  "/optimized/0K0A5725.jpg",
  "/optimized/0K0A7454 (1).jpg",
  "/optimized/0K0A7770.jpg",
  "/optimized/0K0A3921.jpg",
  "/optimized/0K0A3923.jpg",
  "/optimized/0K0A4102.jpg",
  "/optimized/0K0A4172.jpg",
  "/optimized/0K0A4983.jpg",
  "/optimized/basketball-cover.jpg",
  "/optimized/basketball-cover copy.jpg",
]

// Random basketball YouTube videos for placeholder
const placeholderVideos = [
  "https://www.youtube.com/watch?v=oyjYgmsM00Q", // Basketball drills
  "https://www.youtube.com/watch?v=0DpfJfUYr6E", // Dribbling drills
  "https://www.youtube.com/watch?v=1iSZDCE3QGI", // Shooting form
  "https://www.youtube.com/watch?v=6j9NJlqPfyk", // Ball handling
  "https://www.youtube.com/watch?v=kpWw_Xu1VtM", // Defense drills
  "https://www.youtube.com/watch?v=2Kj9XUhQ53s", // Passing drills
  "https://www.youtube.com/watch?v=uUzlgPWGfzQ", // Footwork
  "https://www.youtube.com/watch?v=XiJLdcRc0aE", // Shooting practice
  "https://www.youtube.com/watch?v=3u5PbLxhI0I", // Agility drills
  "https://www.youtube.com/watch?v=Q8Q_y8a9gGY", // Coordination drills
]

// Helper function to get random image
function getRandomImage(): string {
  return availableImages[Math.floor(Math.random() * availableImages.length)]
}

function getRandomVideo(): string {
  return placeholderVideos[Math.floor(Math.random() * placeholderVideos.length)]
}

// Function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function seed() {
  console.log("🏀 Seeding online basketball community channels and videos...")

  // Get the first admin user
  const adminUser = await db.query.users.findFirst({
    where: sql`role IN ('admin', 'super_admin')`,
  })

  if (!adminUser) {
    console.log("⚠️  No admin user found. Please create an admin user first.")
    console.log("Run: UPDATE \"user\" SET role = 'admin' WHERE email = 'your-email@example.com';")
    return
  }

  console.log(`✅ Using admin user: ${adminUser.email}`)

  // Delete existing online channels to start fresh
  console.log("\n🗑️  Deleting existing online channels...")
  const deletedChannels = await db.delete(communityChannels).where(like(communityChannels.slug, "online-%")).returning()
  console.log(`✅ Deleted ${deletedChannels.length} existing channels`)

  const now = new Date()

  // Define the 4 main channels with their episodes
  const channelsData = [
    {
      title: "No Court Accessible (By yourself)",
      slug: "online-no-court-by-yourself",
      description: "Train anywhere, anytime with these no-court drills. Perfect for developing ball handling, shooting form, passing, and defensive footwork.",
      longDescription: "Master basketball fundamentals without needing a court. These drills can be done in your driveway, garage, or any open space. Focus on ball handling, shooting form, passing accuracy, and defensive footwork.",
      category: "basketball" as ChannelCategory,
      sortOrder: 1,
      episodes: [
        // Dribbling category
        { title: "Ball Handling & Co-ordination", category: "dribbling", multipleVideos: true },
        { title: "Tape Ladder", category: "dribbling", multipleVideos: true },
        { title: "Cone Ball Handling", category: "dribbling", multipleVideos: true },
        { title: "Figure 8 Dribbling", category: "dribbling", multipleVideos: true },
        { title: "High Dribble to Low Dribble", category: "dribbling", multipleVideos: true },
        { title: "Wrap Arounds", category: "dribbling", multipleVideos: false },
        { title: "Stationary Dribbling", category: "dribbling", multipleVideos: true },
        { title: "Dribbling on the move", category: "dribbling", multipleVideos: true },
        { title: "Stationary Dribbling (Two Basketballs)", category: "dribbling", multipleVideos: true },
        { title: "Dribbling on the move (Two Basketballs)", category: "dribbling", multipleVideos: true },
        { title: "Dribbling with co-ordination (Tapping Wall)", category: "dribbling", multipleVideos: true },
        { title: "Dribbling with co-ordination (Tennis ball)", category: "dribbling", multipleVideos: true },
        { title: "Dribbling with co-ordination (Two basketball) - Tapping wall", category: "dribbling", multipleVideos: true },
        // Shooting category
        { title: "Form Improvement", category: "shooting", multipleVideos: false },
        // Passing category
        { title: "Spot Passing", category: "passing", multipleVideos: false },
        // Defense category
        { title: "Fire Feet", category: "defense", multipleVideos: false },
      ],
    },
    {
      title: "No Court Accessible (With Partner)",
      slug: "online-no-court-with-partner",
      description: "Partner drills you can do anywhere. Improve your dribbling, passing, and coordination with a teammate.",
      longDescription: "Take your training to the next level with partner drills. These exercises require a teammate but no court, making them perfect for training anywhere. Focus on advanced dribbling, passing accuracy, and coordination.",
      category: "basketball" as ChannelCategory,
      sortOrder: 2,
      episodes: [
        { title: "Dribbling with Tennis ball", category: "dribbling", multipleVideos: true },
        { title: "Dribble combos", category: "dribbling", multipleVideos: true },
        { title: "Partner holds shoulders (Progress forward) with band if you have", category: "dribbling", multipleVideos: false },
        { title: "Partner Dribbling Drills", category: "dribbling", multipleVideos: false },
        { title: "Partner Passing Drills", category: "passing", multipleVideos: false },
      ],
    },
    {
      title: "On Court - By Yourself",
      slug: "online-on-court-by-yourself",
      description: "Court-based drills to master shooting, finishing, and shot creation. Train solo and elevate your game.",
      longDescription: "Maximize your court time with these solo drills. Perfect your shooting from all spots, master finishing at the rim, and develop your shot creation abilities. All drills are designed to be done by yourself.",
      category: "basketball" as ChannelCategory,
      sortOrder: 3,
      episodes: [
        // Shooting category
        { title: "Pressure Free throw shooting (10 in a row, every miss is two back, -10 means you lose)", category: "shooting", multipleVideos: false },
        { title: "Shooting running from spot to spot (Corner to corner, wing to wing, middle back to middle) - Jumpers", category: "shooting", multipleVideos: false },
        { title: "Shooting running from spot to spot (Corner to corner, wing to wing, middle back to middle) - 3s", category: "shooting", multipleVideos: false },
        { title: "Visualization drills", category: "shooting", multipleVideos: false },
        { title: "Shot creation", category: "shooting", multipleVideos: false },
        { title: "Triple Threat into jumpers", category: "shooting", multipleVideos: false },
        // Finishing category
        { title: "Layups (Front rim, far rim, close glass, far glass, freestyle)", category: "finishing", multipleVideos: false },
        { title: "Mikan drills (All variations)", category: "finishing", multipleVideos: false },
        { title: "ALL VARIATIONS, MOVES, SHOTS, FINISHES", category: "finishing", multipleVideos: false },
      ],
    },
    {
      title: "On Court with partner / rebounder",
      slug: "online-on-court-with-partner",
      description: "Advanced court drills with a partner or rebounder. Focus on shooting, finishing, passing, and defense.",
      longDescription: "Take your court training to the next level with partner drills. These exercises require a teammate or rebounder and focus on game-like situations. Master shooting, finishing, passing, and defensive skills.",
      category: "basketball" as ChannelCategory,
      sortOrder: 4,
      episodes: [
        // Note: User said "Titles of videos will be updated as recorded" and "Sections will be as listed above"
        // So we'll create placeholder videos for each category
        { title: "Shooting Drills with Partner", category: "shooting", multipleVideos: false },
        { title: "Finishing Drills with Partner", category: "finishing", multipleVideos: false },
        { title: "Passing Drills with Partner", category: "passing", multipleVideos: false },
        { title: "Defense Drills with Partner", category: "defense", multipleVideos: false },
        { title: "Ball Handling Drills with Partner", category: "dribbling", multipleVideos: false },
      ],
    },
  ]

  console.log("\n📺 Creating main channels...")

  // Create channels and their videos
  for (const channelData of channelsData) {
    const coverImage = getRandomImage()
    
    // Create the channel
    const [channel] = await db.insert(communityChannels).values({
      slug: channelData.slug,
      title: channelData.title,
      description: channelData.description,
      longDescription: channelData.longDescription,
      category: channelData.category,
      status: "published" as ChannelStatus,
      coverImage: coverImage,
      thumbnailImage: coverImage,
      requiredTierLevel: 1,
      isFeatured: false,
      tags: ["online-program", "basketball", "training"],
      videoCount: channelData.episodes.length,
      metaTitle: `${channelData.title} - Online Basketball Training`,
      metaDescription: channelData.description,
      sortOrder: channelData.sortOrder,
      createdBy: adminUser.id,
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
    }).returning()

    console.log(`✅ Created channel: ${channelData.title}`)

    // Create videos/episodes for this channel
    let episodeNumber = 1
    const videosToInsert = []

    for (const episode of channelData.episodes) {
      const videoSlug = createSlug(`${channelData.slug}-${episode.title}`)
      const categoryTags = [episode.category, "online-program", "basketball"]
      
      // If multiple videos, we'll create a placeholder for now
      // The actual videos can be added later
      videosToInsert.push({
        channelId: channel.id,
        slug: videoSlug,
        title: episode.title,
        description: `Learn ${episode.title.toLowerCase()}${episode.multipleVideos ? ' - Multiple video variations available' : ''}. Part of our ${channelData.title} training series.`,
        videoUrl: getRandomVideo(), // Random placeholder video for now
        thumbnailUrl: getRandomImage(),
        duration: 0, // Will be updated when video is added
        isFirstEpisode: episodeNumber === 1, // First episode is free
        episodeNumber: episodeNumber,
        seasonNumber: 1,
        requiredTierLevel: episodeNumber === 1 ? 1 : 2, // First episode free, rest premium
        status: "published" as VideoStatus, // Published so they show up even without video URL yet
        viewCount: 0,
        tags: categoryTags,
        metaTitle: `${episode.title} - ${channelData.title}`,
        metaDescription: `Learn ${episode.title.toLowerCase()} with expert basketball training`,
        createdBy: adminUser.id,
        createdAt: now,
        updatedAt: now,
        publishedAt: now, // Published now
      })

      episodeNumber++
    }

    // Insert all videos for this channel
    const createdVideos = await db.insert(videos).values(videosToInsert).returning()
    console.log(`   📹 Created ${createdVideos.length} video episodes`)

    // Update channel video count
    await db.update(communityChannels)
      .set({ videoCount: createdVideos.length })
      .where(sql`id = ${channel.id}`)
  }

  console.log("\n✨ Online basketball channels and videos seeding complete!")
  console.log("\n📊 Summary:")
  channelsData.forEach((channel) => {
    console.log(`   ${channel.title}: ${channel.episodes.length} episodes`)
  })
}

seed()
  .then(() => {
    console.log("\nDone!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error:", error)
    process.exit(1)
  })

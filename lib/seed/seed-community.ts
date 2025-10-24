import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { membershipTiers, communityChannels, videos, users } from "../db/schema"
import { eq } from "drizzle-orm"
import * as schema from "../db/schema"

async function seedCommunity() {
  console.log("🌱 Seeding community data...")
  
  // Create direct database connection
  const connectionString = process.env.DATABASE_URL!
  const client = postgres(connectionString)
  const db = drizzle(client, { schema })

  // Get admin user (or create a placeholder)
  let adminUser
  try {
    const users_result = await db.query.users.findFirst({
      where: eq(users.role, "admin"),
    })
    adminUser = users_result
  } catch {
    console.log("No admin user found")
    adminUser = null
  }

  if (!adminUser) {
    console.log("⚠️  Creating admin user...")
    const [user] = await db.insert(users).values({
      email: "Indianarotondo@soulworx.ca",
      name: "Admin",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    adminUser = user
  }

  // 1. SEED MEMBERSHIP TIERS
  console.log("\n📊 Checking membership tiers...")
  
  const existingTiers = await db.query.membershipTiers.findMany()
  
  if (existingTiers.length > 0) {
    console.log("✅ Tiers already exist, using existing ones")
  } else {
    console.log("Creating new tiers...")
    await db.insert(membershipTiers).values([
    {
      name: "Community Access",
      slug: "free",
      level: "free",
      description: "Get started with first episodes and community access",
      features: [
        "First episode of every channel",
        "Discord community access",
        "Monthly community updates",
        "Basic support",
      ],
      accessLevel: 1,
      price: "0",
      billingPeriod: "monthly",
      stripePriceId: null, // You'll add this later
      discordRoleId: null, // You'll add this later
      dmAccessEnabled: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Premium Member",
      slug: "premium",
      level: "premium",
      description: "Full access to all video content and resources",
      features: [
        "All videos in all channels",
        "Downloadable resources",
        "Early access to new content",
        "Priority support",
        "Exclusive Discord channels",
        "HD streaming",
      ],
      accessLevel: 2,
      price: "9.99",
      billingPeriod: "monthly",
      stripePriceId: null, // Add your Stripe Price ID here
      discordRoleId: null, // Add your Discord Role ID here
      dmAccessEnabled: false,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "VIP Mentor",
      slug: "vip",
      level: "vip",
      description: "Everything + direct mentorship and exclusive access",
      features: [
        "Everything in Premium",
        "Direct DM access to mentors",
        "1-on-1 monthly mentorship call",
        "Exclusive VIP channels",
        "Priority event registration",
        "Monthly group coaching calls",
        "Career review sessions",
      ],
      accessLevel: 3,
      price: "19.99",
      billingPeriod: "monthly",
      stripePriceId: null, // Add your Stripe Price ID here
      discordRoleId: null, // Add your Discord Role ID here
      dmAccessEnabled: true,
      isActive: true,
      sortOrder: 3,
    },
  ]).returning()

    console.log("✅ Created 3 membership tiers")
  }

  // 2. SEED COMMUNITY CHANNELS
  console.log("\n📺 Checking community channels...")

  const existingChannels = await db.query.communityChannels.findMany()
  
  let basketballChannel, careerChannel, scholarshipChannel, lifeSkillsChannel
  
  if (existingChannels.length > 0) {
    console.log("✅ Channels already exist, using existing ones")
    basketballChannel = existingChannels.find(c => c.slug === "basketball-fundamentals")
    careerChannel = existingChannels.find(c => c.slug === "career-development")
    scholarshipChannel = existingChannels.find(c => c.slug === "athletic-scholarships")
    lifeSkillsChannel = existingChannels.find(c => c.slug === "life-skills")
  } else {
    console.log("Creating new channels...")
    const now = new Date()
    const channels = await db.insert(communityChannels).values([
      {
        slug: "basketball-fundamentals",
        title: "Basketball Fundamentals",
        description: "Master the essential skills to elevate your game",
        longDescription: "Learn from the ground up with comprehensive basketball training. From dribbling and shooting to defensive strategies and game IQ, this channel covers everything you need to dominate on the court.",
        category: "basketball",
        status: "published",
        coverImage: "/optimized/basketball-cover.jpg",
        thumbnailImage: "/optimized/basketball-cover.jpg",
        requiredTierLevel: 1,
        isFeatured: true,
        tags: ["basketball", "sports", "training", "fundamentals"],
        videoCount: 0,
        metaTitle: "Basketball Fundamentals - Soulworx Community",
        metaDescription: "Master basketball fundamentals with expert training videos",
        sortOrder: 1,
        createdBy: adminUser.id,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "career-development",
        title: "Career Development",
        description: "Build the skills to land your dream job",
        longDescription: "Navigate your career journey with confidence. Learn how to write compelling resumes, ace interviews, build your professional network, and negotiate job offers. Get the tools you need to succeed in any career path.",
        category: "career",
        status: "published",
        coverImage: "/optimized/career-cover.jpg",
        thumbnailImage: "/optimized/career-cover.jpg",
        requiredTierLevel: 1,
        isFeatured: true,
        tags: ["career", "professional", "job search", "skills"],
        videoCount: 0,
        metaTitle: "Career Development - Soulworx Community",
        metaDescription: "Professional development resources for youth",
        sortOrder: 2,
        createdBy: adminUser.id,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "athletic-scholarships",
        title: "Athletic Scholarship Guide",
        description: "Navigate the path to college scholarships",
        longDescription: "Everything you need to know about securing an athletic scholarship. From building your highlight reel and reaching out to coaches to understanding NCAA requirements and negotiating offers.",
        category: "scholarships",
        status: "published",
        coverImage: "/optimized/scholarship-cover.jpg",
        thumbnailImage: "/optimized/scholarship-cover.jpg",
        requiredTierLevel: 2,
        isFeatured: true,
        tags: ["scholarships", "college", "athletics", "recruitment"],
        videoCount: 0,
        metaTitle: "Athletic Scholarship Guide - Soulworx Community",
        metaDescription: "Complete guide to athletic scholarships for youth athletes",
        sortOrder: 3,
        createdBy: adminUser.id,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "life-skills",
        title: "Essential Life Skills",
        description: "Build the foundation for long-term success",
        longDescription: "Master the life skills that will serve you forever. Financial literacy, time management, communication skills, mental health, and personal development strategies for sustained success.",
        category: "life_skills",
        status: "published",
        coverImage: "/optimized/life-skills-cover.jpg",
        thumbnailImage: "/optimized/life-skills-cover.jpg",
        requiredTierLevel: 1,
        isFeatured: false,
        tags: ["life skills", "personal development", "financial literacy"],
        videoCount: 0,
        metaTitle: "Essential Life Skills - Soulworx Community",
        metaDescription: "Life skills education for youth success",
        sortOrder: 4,
        createdBy: adminUser.id,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ]).returning()

    basketballChannel = channels[0]
    careerChannel = channels[1]
    scholarshipChannel = channels[2]
    lifeSkillsChannel = channels[3]
    console.log("✅ Created 4 community channels")
  }

  // 3. SEED VIDEOS
  console.log("\n🎥 Checking videos...")
  
  const existingVideos = await db.query.videos.findMany()
  
  if (existingVideos.length > 0) {
    console.log("✅ Videos already exist, skipping video creation")
  } else {
    console.log("Creating videos...")
    const now = new Date()
    
    // Basketball Videos
    if (basketballChannel) {
      await db.insert(videos).values([
    {
      channelId: basketballChannel.id,
      slug: "dribbling-basics",
      title: "Dribbling Basics - Foundation of Ball Handling",
      description: "Learn the fundamental dribbling techniques every player needs. Master crossovers, between-the-legs, and behind-the-back moves.",
      videoUrl: "https://www.youtube.com/watch?v=example1", // Replace with real URLs
      thumbnailUrl: "/optimized/basketball-cover.jpg",
      duration: 900, // 15 minutes
      isFirstEpisode: true, // FREE for everyone
      episodeNumber: 1,
      seasonNumber: 1,
      requiredTierLevel: 1,
      status: "published",
      viewCount: 0,
      tags: ["dribbling", "ball handling", "fundamentals"],
      metaTitle: "Dribbling Basics Tutorial",
      metaDescription: "Master fundamental basketball dribbling techniques",
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      channelId: basketballChannel.id,
      slug: "shooting-form",
      title: "Perfect Your Shooting Form",
      description: "Break down the mechanics of a perfect shot. Learn proper footwork, hand placement, follow-through, and consistency drills.",
      videoUrl: "https://www.youtube.com/watch?v=example2",
      thumbnailUrl: "/optimized/0K0A4923.jpg",
      duration: 1200,
      isFirstEpisode: false,
      episodeNumber: 2,
      seasonNumber: 1,
      requiredTierLevel: 2, // Premium required
      status: "published",
      viewCount: 0,
      tags: ["shooting", "form", "technique"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      channelId: basketballChannel.id,
      slug: "defensive-fundamentals",
      title: "Defensive Fundamentals - Lock Down Your Opponent",
      description: "Master defensive stance, footwork, and positioning. Learn how to stay in front of your man and force turnovers.",
      videoUrl: "https://www.youtube.com/watch?v=example3",
      thumbnailUrl: "/optimized/0K0A5081.jpg",
      duration: 1080,
      isFirstEpisode: false,
      episodeNumber: 3,
      seasonNumber: 1,
      requiredTierLevel: 2,
      status: "published",
      viewCount: 0,
      tags: ["defense", "footwork", "positioning"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      channelId: basketballChannel.id,
      slug: "game-iq-reading-defense",
      title: "Game IQ: Reading the Defense",
      description: "Develop your basketball IQ. Learn to read defenses, make quick decisions, and elevate your team's performance.",
      videoUrl: "https://www.youtube.com/watch?v=example4",
      thumbnailUrl: "/optimized/0K0A4950.jpg",
      duration: 1500,
      isFirstEpisode: false,
      episodeNumber: 4,
      seasonNumber: 1,
      requiredTierLevel: 3, // VIP only
      status: "published",
      viewCount: 0,
      tags: ["game iq", "strategy", "basketball intelligence"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ])
    }

  // Career Development Videos
    if (careerChannel) {
      await db.insert(videos).values([
    {
      channelId: careerChannel.id,
      slug: "resume-writing-101",
      title: "Resume Writing 101 - Stand Out From the Crowd",
      description: "Create a resume that gets you interviews. Learn what hiring managers look for and how to showcase your strengths.",
      videoUrl: "https://www.youtube.com/watch?v=example5",
      thumbnailUrl: "/optimized/career-cover.jpg",
      duration: 720,
      isFirstEpisode: true, // FREE
      episodeNumber: 1,
      seasonNumber: 1,
      requiredTierLevel: 1,
      status: "published",
      viewCount: 0,
      tags: ["resume", "job search", "career"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      channelId: careerChannel.id,
      slug: "interview-mastery",
      title: "Interview Mastery - Ace Any Interview",
      description: "Master the art of interviewing. From behavioral questions to negotiation tactics, learn how to leave a lasting impression.",
      videoUrl: "https://www.youtube.com/watch?v=example6",
      thumbnailUrl: "/optimized/0K0A2892.jpg",
      duration: 1800,
      isFirstEpisode: false,
      episodeNumber: 2,
      seasonNumber: 1,
      requiredTierLevel: 2,
      status: "published",
      viewCount: 0,
      tags: ["interviews", "job search", "communication"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      channelId: careerChannel.id,
      slug: "networking-strategies",
      title: "Networking Strategies for Success",
      description: "Build a powerful professional network. Learn how to connect authentically and create opportunities.",
      videoUrl: "https://www.youtube.com/watch?v=example7",
      thumbnailUrl: "/optimized/0K0A2885.jpg",
      duration: 960,
      isFirstEpisode: false,
      episodeNumber: 3,
      seasonNumber: 1,
      requiredTierLevel: 2,
      status: "published",
      viewCount: 0,
      tags: ["networking", "professional development", "relationships"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ])
    }

  // Scholarship Videos
    if (scholarshipChannel) {
      await db.insert(videos).values([
    {
      channelId: scholarshipChannel.id,
      slug: "scholarship-overview",
      title: "Athletic Scholarships 101 - Getting Started",
      description: "Overview of the athletic scholarship landscape. Understand NCAA divisions, eligibility requirements, and the recruiting timeline.",
      videoUrl: "https://www.youtube.com/watch?v=example8",
      thumbnailUrl: "/optimized/scholarship-cover.jpg",
      duration: 1200,
      isFirstEpisode: true, // FREE
      episodeNumber: 1,
      seasonNumber: 1,
      requiredTierLevel: 1,
      status: "published",
      viewCount: 0,
      tags: ["scholarships", "ncaa", "recruiting"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      channelId: scholarshipChannel.id,
      slug: "highlight-reel",
      title: "Creating Your Highlight Reel",
      description: "Build a highlight reel that catches coaches' attention. Learn what to include, how to edit, and where to share.",
      videoUrl: "https://www.youtube.com/watch?v=example9",
      thumbnailUrl: "/optimized/0K0A3921.jpg",
      duration: 1440,
      isFirstEpisode: false,
      episodeNumber: 2,
      seasonNumber: 1,
      requiredTierLevel: 2,
      status: "published",
      viewCount: 0,
      tags: ["highlight reel", "recruiting", "video"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      channelId: scholarshipChannel.id,
      slug: "contacting-coaches",
      title: "How to Contact College Coaches",
      description: "Master the art of reaching out to coaches. Email templates, what to say, when to follow up, and how to make an impression.",
      videoUrl: "https://www.youtube.com/watch?v=example10",
      thumbnailUrl: "/optimized/0K0A5207.jpg",
      duration: 900,
      isFirstEpisode: false,
      episodeNumber: 3,
      seasonNumber: 1,
      requiredTierLevel: 2,
      status: "published",
      viewCount: 0,
      tags: ["recruiting", "coaches", "communication"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ])
    }

  // Life Skills Videos
    if (lifeSkillsChannel) {
      await db.insert(videos).values([
    {
      channelId: lifeSkillsChannel.id,
      slug: "financial-literacy-basics",
      title: "Financial Literacy 101 - Money Management",
      description: "Learn the basics of personal finance. Budgeting, saving, credit, and building wealth for your future.",
      videoUrl: "https://www.youtube.com/watch?v=example11",
      thumbnailUrl: "/optimized/life-skills-cover.jpg",
      duration: 1080,
      isFirstEpisode: true, // FREE
      episodeNumber: 1,
      seasonNumber: 1,
      requiredTierLevel: 1,
      status: "published",
      viewCount: 0,
      tags: ["finance", "money", "budgeting"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      channelId: lifeSkillsChannel.id,
      slug: "time-management",
      title: "Time Management for Student Athletes",
      description: "Balance school, sports, and life. Learn productivity techniques and time management strategies that work.",
      videoUrl: "https://www.youtube.com/watch?v=example12",
      thumbnailUrl: "/optimized/0K0A5225.jpg",
      duration: 840,
      isFirstEpisode: false,
      episodeNumber: 2,
      seasonNumber: 1,
      requiredTierLevel: 2,
      status: "published",
      viewCount: 0,
      tags: ["time management", "productivity", "organization"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      channelId: lifeSkillsChannel.id,
      slug: "mental-health-resilience",
      title: "Mental Health & Building Resilience",
      description: "Take care of your mental health. Learn strategies for managing stress, building resilience, and maintaining balance.",
      videoUrl: "https://www.youtube.com/watch?v=example13",
      thumbnailUrl: "/optimized/0K0A2899.jpg",
      duration: 1200,
      isFirstEpisode: false,
      episodeNumber: 3,
      seasonNumber: 1,
      requiredTierLevel: 2,
      status: "published",
      viewCount: 0,
      tags: ["mental health", "wellness", "resilience"],
      createdBy: adminUser.id,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ])
    }

    // Update channel video counts
    if (basketballChannel) await db.update(communityChannels).set({ videoCount: 4 }).where(eq(communityChannels.id, basketballChannel.id))
    if (careerChannel) await db.update(communityChannels).set({ videoCount: 3 }).where(eq(communityChannels.id, careerChannel.id))
    if (scholarshipChannel) await db.update(communityChannels).set({ videoCount: 3 }).where(eq(communityChannels.id, scholarshipChannel.id))
    if (lifeSkillsChannel) await db.update(communityChannels).set({ videoCount: 3 }).where(eq(communityChannels.id, lifeSkillsChannel.id))

    console.log("✅ Created 13 videos across 4 channels")
  }

  console.log("\n✨ Community seeding complete!")
  console.log("\n📝 NEXT STEPS:")
  console.log("1. Update membership tiers with your Discord Role IDs")
  console.log("2. Add Stripe Price IDs to Premium and VIP tiers")
  console.log("3. Replace video URLs with your actual YouTube/Vimeo links")
  console.log("4. Update image paths with your actual images")
  console.log("\n🚀 You can now visit /programs/community to see your channels!")
}

seedCommunity()
  .then(() => {
    console.log("\n✅ Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Error seeding community:", error)
    console.error(error)
    process.exit(1)
  })


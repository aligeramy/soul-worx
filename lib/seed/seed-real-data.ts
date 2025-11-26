// Seed script for real Soulworx programs, events, and community channels
// Usage: tsx lib/seed-real-data.ts

import "dotenv/config"
import { db } from "../db/index"
import { programs, events, communityChannels, type ProgramCategory, type ProgramStatus, type EventStatus, type ChannelStatus, type ChannelCategory } from "../db/schema"
import { sql } from "drizzle-orm"

async function seed() {
  console.log("🌱 Seeding real Soulworx data...")

  // Get the first admin user (or create one if none exists)
  const adminUser = await db.query.users.findFirst({
    where: sql`role IN ('admin', 'super_admin')`,
  })

  if (!adminUser) {
    console.log("⚠️  No admin user found. Please create an admin user first.")
    console.log("Run: UPDATE \"user\" SET role = 'admin' WHERE email = 'your-email@example.com';")
    return
  }

  console.log(`✅ Using admin user: ${adminUser.email}`)

  // Clear existing programs (keeping IDs for cascade relationships)
  await db.delete(programs)
  console.log("🗑️  Cleared existing programs")

  // Create real programs
  const programData = [
    {
      slug: "future-stars-basketball",
      title: "Future Stars Basketball",
      description: "Future Stars brings back what youth basketball should be about — fun, growth, and opportunity. Led by former NCAA scholarship athletes and community coaches, this program focuses on skill development, teamwork, and life lessons.",
      longDescription: `
        <p>Future Stars brings back what youth basketball should be about — fun, growth, and opportunity. Led by former NCAA scholarship athletes and community coaches, this program focuses on skill development, teamwork, and life lessons.</p>
        <p>With affordable access and genuine mentorship, we're helping kids fall in love with the game while learning values that extend far beyond the court.</p>
        <h3>Program Details:</h3>
        <ul>
          <li>Skill development focused on fundamentals</li>
          <li>Leadership and teamwork building</li>
          <li>Life lessons through sport</li>
          <li>Mentorship from experienced coaches</li>
        </ul>
      `,
      category: "youth" as ProgramCategory,
      status: "published" as ProgramStatus,
      coverImage: "/optimized/P1290712.jpeg",
      images: ["/optimized/0K0A4923.jpg"],
      duration: "Year-round",
      ageRange: "Ages 8-18",
      capacity: 50,
      price: "0.00",
      registrationRequired: true,
      requiresParentConsent: true,
      tags: ["basketball", "youth", "sports", "mentorship"],
      faqs: [
        {
          question: "Where is the program located?",
          answer: "Stephen Lewis Secondary School"
        },
        {
          question: "What equipment do I need?",
          answer: "Just basketball shoes and comfortable athletic wear. Basketballs are provided."
        }
      ],
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: adminUser.id,
    },
    {
      slug: "future-ready-program-cibc",
      title: "Future Ready Program (CIBC)",
      description: "Future Ready empowers youth with the skills schools often overlook — financial literacy, networking, and self-discovery. Through practical workshops and mentorship, students learn how to manage money, identify their strengths, and build a future that supports both themselves and their families.",
      longDescription: `
        <p>Future Ready empowers youth with the skills schools often overlook — financial literacy, networking, and self-discovery. Through practical workshops and mentorship, students learn how to manage money, identify their strengths, and build a future that supports both themselves and their families.</p>
        <p>This program shows that success isn't just about where you start — it's about the tools and guidance you receive along the way.</p>
        <h3>Program Components:</h3>
        <ul>
          <li>Financial literacy and money management</li>
          <li>Networking and professional development</li>
          <li>Self-discovery and strengths identification</li>
          <li>Career planning and goal setting</li>
        </ul>
      `,
      category: "youth" as ProgramCategory,
      status: "published" as ProgramStatus,
      coverImage: "/optimized/0K0A4950.jpg",
      images: ["/optimized/0K0A5119.jpg"],
      duration: "6 weeks",
      ageRange: "Ages 16-24",
      capacity: 30,
      price: "0.00",
      registrationRequired: true,
      requiresParentConsent: false,
      tags: ["career", "financial-literacy", "youth", "professional-development"],
      faqs: [
        {
          question: "Where are the workshops held?",
          answer: "CIBC Branches GTA wide - locations vary by cohort"
        },
        {
          question: "Is there a cost to participate?",
          answer: "No, this program is completely free thanks to CIBC's support."
        }
      ],
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: adminUser.id,
    },
    {
      slug: "future-arts-program",
      title: "Future Arts Program",
      description: "Future Arts gives young people a space to express themselves, explore creativity, and find healing through writing and storytelling. Created by a published poet and educator, this program encourages youth to use words and art as a source of confidence, clarity, and connection.",
      longDescription: `
        <p>Future Arts gives young people a space to express themselves, explore creativity, and find healing through writing and storytelling. Created by a published poet and educator, this program encourages youth to use words and art as a source of confidence, clarity, and connection.</p>
        <p>It's not about creating artists — it's about creating balance, self-belief, and emotional growth in a world that often overlooks it.</p>
        <h3>What You'll Gain:</h3>
        <ul>
          <li>Creative expression through writing and storytelling</li>
          <li>Emotional healing and processing</li>
          <li>Confidence and self-belief</li>
          <li>Connection with yourself and others</li>
        </ul>
      `,
      category: "youth" as ProgramCategory,
      status: "published" as ProgramStatus,
      coverImage: "/optimized/0K0A2885.jpg",
      images: ["/optimized/0K0A4102.jpg"],
      duration: "8 weeks",
      ageRange: "Ages 13-25",
      capacity: 20,
      price: null,
      registrationRequired: true,
      requiresParentConsent: true,
      tags: ["arts", "writing", "poetry", "creativity", "healing"],
      faqs: [
        {
          question: "Do I need writing experience?",
          answer: "No experience necessary. This program is for anyone who wants to explore creative expression."
        },
        {
          question: "Where is the program located?",
          answer: "Location TBD - check back soon for updates"
        }
      ],
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: adminUser.id,
    },
    {
      slug: "special-events",
      title: "Special Events",
      description: "One-time events and celebrations across all Soulworx programs and initiatives",
      longDescription: `
        <p>Join us for special one-time events that bring our community together. From basketball tournaments to poetry nights and book signings, these events celebrate the diverse activities happening across Soulworx.</p>
      `,
      category: "special" as ProgramCategory,
      status: "published" as ProgramStatus,
      coverImage: "/optimized/0K0A3921.jpg",
      images: ["/optimized/0K0A4102.jpg"],
      duration: "Single events",
      ageRange: "All ages",
      capacity: null,
      price: "0.00",
      registrationRequired: false,
      requiresParentConsent: false,
      tags: ["events", "special", "community"],
      faqs: [],
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: adminUser.id,
    },
  ]

  const createdPrograms = await db.insert(programs).values(programData).returning()
  console.log(`✅ Created ${createdPrograms.length} programs`)

  // Clear existing events
  await db.delete(events)
  console.log("🗑️  Cleared existing events")

  // Find programs for events
  const futureStarsProgram = createdPrograms.find(p => p.slug === "future-stars-basketball")
  const futureReadyProgram = createdPrograms.find(p => p.slug === "future-ready-program-cibc")
  const futureArtsProgram = createdPrograms.find(p => p.slug === "future-arts-program")
  const specialEventsProgram = createdPrograms.find(p => p.slug === "special-events")

  // Create events
  const eventData = [
    {
      programId: futureReadyProgram!.id, // Future Ready (CIBC)
      title: "Future Ready (CIBC) Workshop",
      description: "Join us for financial literacy, networking, and career development workshops",
      startTime: new Date("2025-11-29T10:00:00"),
      endTime: new Date("2025-11-29T16:00:00"),
      timezone: "America/Toronto",
      locationType: "in_person" as const,
      venueName: "CIBC Branch",
      venueAddress: null,
      venueCity: "GTA",
      capacity: 30,
      status: "scheduled" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      programId: futureStarsProgram!.id, // Future Stars Basketball
      title: "Future Stars Basketball Session",
      description: "Join us for basketball training, skill development, and mentorship",
      startTime: new Date("2025-10-25T14:00:00"),
      endTime: new Date("2025-10-25T18:00:00"),
      timezone: "America/Toronto",
      locationType: "in_person" as const,
      venueName: "Stephen Lewis Secondary School",
      venueAddress: null,
      venueCity: null,
      capacity: 50,
      status: "scheduled" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      programId: futureArtsProgram!.id, // Future Arts Program
      title: "Future Arts Program Session",
      description: "Coming soon - Join us for creative expression through writing and storytelling",
      startTime: new Date("2026-01-15T10:00:00"),
      endTime: new Date("2026-01-15T16:00:00"),
      timezone: "America/Toronto",
      locationType: "in_person" as const,
      venueName: "TBD",
      venueAddress: null,
      venueCity: null,
      capacity: 20,
      status: "postponed" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Standalone special events
    {
      programId: specialEventsProgram!.id,
      title: "3x3 Men's Charity Basketball Tournament",
      description: "Join us for an exciting 3x3 basketball tournament to support youth programs",
      startTime: new Date("2026-05-15T10:00:00"),
      endTime: new Date("2026-05-15T16:00:00"),
      timezone: "America/Toronto",
      locationType: "in_person" as const,
      venueName: "St. Elizabeth CHS",
      venueAddress: null,
      venueCity: null,
      capacity: 16,
      status: "scheduled" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      programId: specialEventsProgram!.id,
      title: "Poetry Event",
      description: "An evening of spoken word poetry featuring local poets and community members (19+)",
      startTime: new Date("2026-01-17T19:00:00"),
      endTime: new Date("2026-01-17T22:00:00"),
      timezone: "America/Toronto",
      locationType: "in_person" as const,
      venueName: "Maverick Brewery",
      venueAddress: null,
      venueCity: null,
      capacity: 50,
      status: "scheduled" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      programId: specialEventsProgram!.id,
      title: "Book Signing",
      description: "Meet the author and get your copy of 'The Ripple Effect' signed",
      startTime: new Date("2025-11-08T13:00:00"),
      endTime: new Date("2025-11-08T17:00:00"),
      timezone: "America/Toronto",
      locationType: "in_person" as const,
      venueName: "Markville Mall",
      venueAddress: null,
      venueCity: null,
      capacity: 100,
      status: "scheduled" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(events).values(eventData)
  console.log(`✅ Created ${eventData.length} events`)

  // Clear existing channels
  await db.delete(communityChannels)
  console.log("🗑️  Cleared existing community channels")

  // Create community channels
  const channelData = [
    {
      slug: "basketball-fundamentals",
      title: "Basketball Fundamentals",
      description: "Master the fundamentals of basketball with at-home and on-court training videos",
      longDescription: `
        <p>Comprehensive basketball training for all skill levels. Learn fundamental skills, drills, and techniques that will elevate your game.</p>
        <h3>Available Videos:</h3>
        <ul>
          <li>At home training videos (By yourself)</li>
          <li>At home training videos (With Partner)</li>
          <li>On court (By yourself)</li>
          <li>On court (With partner / Rebounder)</li>
        </ul>
        <p>Scholarship opportunities can be explored through this channel.</p>
      `,
      category: "basketball" as ChannelCategory,
      status: "published" as ChannelStatus,
      coverImage: "/optimized/0K0A5232.jpg",
      thumbnailImage: "/optimized/0K0A4923.jpg",
      requiredTierLevel: 1,
      isFeatured: true,
      tags: ["basketball", "training", "fundamentals", "sports"],
      videoCount: 0,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },
    {
      slug: "life-skills-career-development",
      title: "Life Skills & Career Development",
      description: "Build essential life skills and develop your career path with goal setting, personality assessments, and practical resources",
      longDescription: `
        <p>Equip yourself with the tools for success. This channel combines life skills training with career development resources.</p>
        <h3>Features:</h3>
        <ul>
          <li>Writing down goals section - 3 month, 6 month, 1 year, 3 year and 5 year plans</li>
          <li>Understanding your skills and passions</li>
          <li>Personality test assessments</li>
          <li>Dedicated Spending 1 hour per week</li>
          <li>Link to Abtin's App (Ancr) for mental health stability</li>
        </ul>
      `,
      category: "life_skills" as ChannelCategory,
      status: "published" as ChannelStatus,
      coverImage: "/optimized/0K0A4950.jpg",
      thumbnailImage: "/optimized/0K0A5119.jpg",
      requiredTierLevel: 1,
      isFeatured: true,
      tags: ["career", "life-skills", "personal-development", "goals"],
      videoCount: 0,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },
    {
      slug: "creative-arts-online",
      title: "Creative Arts Online Program",
      description: "Express yourself through creative arts - details coming soon",
      longDescription: `
        <p>An online creative arts program designed to help you explore your artistic side. More details coming soon.</p>
      `,
      category: "other" as ChannelCategory,
      status: "draft" as ChannelStatus,
      coverImage: "/optimized/0K0A2885.jpg",
      thumbnailImage: "/optimized/0K0A4102.jpg",
      requiredTierLevel: 1,
      isFeatured: false,
      tags: ["arts", "creativity", "online"],
      videoCount: 0,
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: null,
      createdBy: adminUser.id,
    },
  ]

  await db.insert(communityChannels).values(channelData)
  console.log(`✅ Created ${channelData.length} community channels`)

  console.log("✨ Seeding complete!")
}

seed()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })


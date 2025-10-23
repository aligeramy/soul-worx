// Run this script to seed only the stories (posts)
// Usage: tsx lib/seed-stories-only.ts

import "dotenv/config"
import { db } from "./db/index"
import { posts, type PostCategory, type PostStatus } from "./db/schema"

async function seedStories() {
  console.log("Seeding stories...")

  // Get the admin user
  const adminEmail = "admin@soulworx.com"
  const adminUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, adminEmail)
  })

  if (!adminUser) {
    console.log("Admin user not found. Please run the main seed script first: npm run db:seed")
    process.exit(1)
  }

  console.log(`Using user ID: ${adminUser.id}`)

  // Delete existing posts to avoid duplicates
  console.log("Clearing existing stories...")
  await db.delete(posts)

  // Sample Stories/Posts - With real content
  const postsData = [
    // EVENT RECAPS
    {
      slug: "book-complex-poetry-event-coverage",
      title: "The Book Complex Covers 2nd Poetry Event",
      excerpt: "Toronto Guardian coverage of Soulworx's poetry event featuring powerful performances and community connection.",
      content: `
        <p>The Toronto Guardian featured coverage of Soulworx's 2nd Poetry Event, highlighting the powerful spoken word performances and community impact of the evening.</p>
        
        <p>The event showcased talented poets sharing their truth through spoken word, creating an atmosphere of connection and artistic expression that resonated with audiences.</p>
        
        <p>Read the full coverage in Toronto Guardian's arts section for a deeper look into the vibrant poetry scene Soulworx continues to build.</p>
      `,
      coverImage: "/optimized/0K0A4950.jpg",
      category: "news" as PostCategory,
      status: "published" as PostStatus,
      tags: ["events", "press", "coverage"],
      readTime: 2,
      viewCount: 342,
      authorId: adminUser.id,
      publishedAt: new Date("2024-06-15"),
      createdAt: new Date("2024-06-14"),
      updatedAt: new Date("2024-06-15"),
    },
    {
      slug: "3rd-annual-poetry-event-bar-serene",
      title: "3rd annual Soulworx Poetry Event @ Bar Serene – July 26, 2024",
      excerpt: "An unforgettable night of spoken word, storytelling, and connection at Bar Serene featuring 10+ artists and over 300 attendees.",
      content: `
        <p>On July 26th, Soulworx curated an unforgettable night of spoken word, storytelling, and connection at Bar Serene. In collaboration with Duma and powered by the sounds of DJ Solo, the event welcomed a packed audience of over 300 people, transforming the venue into a space of raw emotion, creativity, and community energy.</p>
        
        <h2>The Performances</h2>
        <p>The evening featured 10+ powerful spoken word artists, each bringing their own voice and truth to the stage. From love and heartbreak to culture, identity, and resilience, the performers shared work that resonated deeply with the audience.</p>
        
        <p>Midway through the night, we opened the floor for an open mic session, inviting members of the crowd to perform. What followed were some of the most memorable moments of the night—people stepping out of their comfort zones to speak their hearts, many performing for the first time. The room responded with nothing but love, support, and applause.</p>
        
        <h2>More Than a Poetry Event</h2>
        <p>This was more than a poetry event. It was a reminder of what happens when people come together without judgment—when creativity meets community. Soulworx continues to build spaces where expression is celebrated, authenticity is encouraged, and art becomes a way to heal, empower, and bring people together.</p>
        
        <blockquote>"With strong community impact, powerful performances, and a growing movement behind it, the July 26th event at Bar Serene was a major milestone in the evolution of Soulworx poetry experiences—and just a glimpse of what's still to come."</blockquote>
        
        <p>Thank you to all the artists, attendees, and partners who made this evening possible. Your presence and participation continue to inspire us to create spaces where every voice matters.</p>
      `,
      coverImage: "/optimized/0K0A4950.jpg",
      category: "news" as PostCategory,
      status: "published" as PostStatus,
      tags: ["events", "poetry", "community", "bar-serene"],
      readTime: 4,
      viewCount: 528,
      authorId: adminUser.id,
      publishedAt: new Date("2024-07-28"),
      createdAt: new Date("2024-07-27"),
      updatedAt: new Date("2024-07-28"),
    },
    {
      slug: "2nd-annual-3x3-charity-basketball-tournament",
      title: "2nd Annual Soulworx 3x3 Charity Basketball Tournament",
      excerpt: "The Soulworx 3x3 Charity Basketball Tournament united athletes, families, creatives, entrepreneurs, and community leaders for impact through sport.",
      content: `
        <p>The Soulworx 3x3 Charity Basketball Tournament returned this year with another unforgettable event—uniting athletes, families, creatives, entrepreneurs, and community leaders under one purpose: impact through sport.</p>
        
        <h2>The Tournament</h2>
        <p>Hosted in the Greater Toronto Area, the tournament welcomed 250+ attendees, 8 competitive teams, and 10 local vendors and sponsors who came together to compete, connect, and give back. The energy was high from the opening tip to the final whistle, showcasing the passion and culture that lives within our community.</p>
        
        <h2>The Champions</h2>
        <p>High Heat claimed this year's championship title, led by outstanding performances from Co-MVPs Kobey Lam and Marcus Anderson, who set the tone with grit, leadership, and elite play on both ends of the floor.</p>
        
        <h2>The Impact</h2>
        <p>More than a tournament, this event carries purpose. Thanks to the generosity of our players, supporters, and partners, $2,100 was raised for Stella's Place—a Toronto-based organization dedicated to youth and young adult mental health services. Together, we continue to use basketball as a platform for healing, growth, and opportunity.</p>
        
        <blockquote>"The Soulworx 3x3 tournament has quickly evolved into an annual community tradition—and we're just getting started. Bigger stage. Bigger platform. Bigger purpose."</blockquote>
        
        <p>Stay tuned for next year's tournament announcement. Thank you to all teams, participants, volunteers, and supporters who made this event a success.</p>
      `,
      coverImage: "/optimized/0K0A4950.jpg",
      category: "news" as PostCategory,
      status: "published" as PostStatus,
      tags: ["events", "basketball", "charity", "sports"],
      readTime: 4,
      viewCount: 687,
      authorId: adminUser.id,
      publishedAt: new Date("2024-08-15"),
      createdAt: new Date("2024-08-14"),
      updatedAt: new Date("2024-08-15"),
    },
    
    // PRESS & MEDIA
    {
      slug: "writers-digest-self-published-book-awards",
      title: "Judge Comments: 32nd Annual Writer's Digest Self-Published Book Awards",
      excerpt: "Honored recognition from Writer's Digest judges on poetic sensory details, structure, and brave storytelling.",
      content: `
        <h2>Judge Comments from the 32nd Annual Writer's Digest Self-Published Book Awards</h2>
        
        <blockquote>
          <p>"Gorgeous sensory details in the poems, like 'craters of the heart' and 'Path,' rich in experiential detail and brave change in format. Nice variation of sentence structure to give the poems a sense of movement. Again, 'I would know you in different lives' achieves a rare honor in my own judging: praising it twice. It's quite beautiful."</p>
        </blockquote>
        
        <h2>Structure & Organization</h2>
        <p>This book is exemplary in its structure, organization, and pacing. The structure of the chapters/parts aid in a compelling organization of the story or information. The pacing is even throughout and matches the tone/genre of the book.</p>
        
        <h2>The Universal Theme of Loss</h2>
        <p>Loss is a universal pain, although sometimes loss is a goal. The author walks the circles of this topic very mindfully. We find ourselves as if dropped into a photo the moment the shutter clicks, and all we can do is look around, feeling the emotions of it.</p>
        
        <blockquote>
          <p>"'Me N Mine' was captivating: 'I would know you in different lives.' We all feel like a great love transports you to another time, and love outdoes the laws of science. Each poem gives us a new experience, and we feel the different bumps and sharp edges of loss. The author has traversed the experiences well."</blockquote>
        </p>
        
        <h2>Visual Design</h2>
        <p>I'm entranced by the cover image, the glowing green, sundown teal and the use of gold in the lettering. This looks like an upscale comic book with characters who belong there, but we get the essence of character in the author's writing.</p>
        
        <p>This recognition from Writer's Digest honors the depth, vulnerability, and artistry present in the collection—a celebration of poetry that speaks to universal experiences through personal narrative.</p>
      `,
      coverImage: "/optimized/0K0A7770.jpg",
      category: "announcements" as PostCategory,
      status: "published" as PostStatus,
      tags: ["press", "awards", "recognition", "writing"],
      readTime: 3,
      viewCount: 421,
      authorId: adminUser.id,
      publishedAt: new Date("2024-09-20"),
      createdAt: new Date("2024-09-19"),
      updatedAt: new Date("2024-09-20"),
    }
  ]

  console.log("Creating stories/posts...")
  const createdPosts = await db.insert(posts).values(postsData).returning()
  console.log(`Created ${createdPosts.length} stories`)

  console.log("\nStory seeding complete!")
  console.log("\nSummary:")
  console.log(`   - ${createdPosts.length} stories created`)
  console.log("\nStory Categories:")
  console.log("   Event Recaps: Real events and community gatherings")
  console.log("   Press & Media: Recognition and awards")
  console.log("\nNext steps:")
  console.log("1. Visit /stories/events for event recaps")
  console.log("2. Visit /stories/press for press & media coverage")
  console.log("3. Visit /dashboard/admin/stories to create new stories")
  
  process.exit(0)
}

seedStories().catch((error) => {
  console.error("Story seeding failed:", error)
  process.exit(1)
})

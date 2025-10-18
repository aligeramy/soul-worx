// Run this script to seed the database with sample data
// Usage: tsx lib/seed-data.ts

import "dotenv/config"
import { db } from "./db/index"
import { programs, events, users, posts, products, type ProgramCategory, type ProgramStatus, type EventStatus, type PostCategory, type PostStatus } from "./db/schema"

async function seed() {
  console.log("🌱 Seeding database...")

  // Create a sample admin user (you'll need to sign in with OAuth first, then update their role)
  console.log("Note: Sign in with OAuth first, then run this query to make yourself admin:")
  console.log("UPDATE \"user\" SET role = 'admin' WHERE email = 'your-email@example.com';")

  // Sample Programs
  const programsData = [
    {
      slug: "youth-spoken-word-intensive",
      title: "Youth Spoken Word Intensive",
      description: "A transformative 8-week program where young voices discover the power of spoken word poetry.",
      longDescription: `
        <p>Join us for an immersive journey into the world of spoken word poetry. This intensive program is designed for youth ages 13-18 who want to find their voice, share their stories, and connect with their community through the power of words.</p>
        <h3>What You'll Learn:</h3>
        <ul>
          <li>Fundamental techniques of spoken word poetry</li>
          <li>Performance skills and stage presence</li>
          <li>Writing authentic, powerful narratives</li>
          <li>Community building through shared expression</li>
        </ul>
        <h3>Program Highlights:</h3>
        <ul>
          <li>Weekly workshops with professional poets</li>
          <li>Open mic performances</li>
          <li>Final showcase event</li>
          <li>Certificate of completion</li>
        </ul>
      `,
      category: "youth" as ProgramCategory,
      status: "published" as ProgramStatus,
      coverImage: "/optimized/0K0A4950.jpg",
      images: ["/optimized/0K0A5119.jpg", "/optimized/0K0A3921.jpg", "/optimized/0K0A4102.jpg"],
      duration: "8 weeks",
      ageRange: "13-18 years",
      capacity: 25,
      price: "0.00",
      registrationRequired: true,
      requiresParentConsent: true,
      tags: ["poetry", "youth", "performance", "creative-writing"],
      faqs: [
        {
          question: "Do I need previous poetry experience?",
          answer: "No experience necessary! This program welcomes poets of all levels, from complete beginners to experienced writers."
        },
        {
          question: "What should I bring to workshops?",
          answer: "Just bring yourself, a notebook, and an open mind. We'll provide all other materials."
        },
        {
          question: "Will there be a performance?",
          answer: "Yes! The program culminates in a showcase where participants can share their work with family and friends. Performance is encouraged but not required."
        }
      ],
      publishedAt: new Date("2025-09-01"),
      createdAt: new Date("2025-08-15"),
      updatedAt: new Date("2025-09-01"),
    },
    {
      slug: "school-workshop-series",
      title: "School Workshop Series",
      description: "Interactive poetry workshops designed specifically for classroom settings and school assemblies.",
      longDescription: `
        <p>Bring the transformative power of spoken word poetry to your school. Our workshop series engages students through interactive sessions that combine poetry, performance, and personal expression.</p>
        <h3>Workshop Format:</h3>
        <p>Each workshop is 60-90 minutes and can be customized for different grade levels and class sizes. We work with teachers to align content with curriculum goals while maintaining creative freedom.</p>
        <h3>Benefits for Students:</h3>
        <ul>
          <li>Improved communication skills</li>
          <li>Enhanced creative expression</li>
          <li>Increased confidence</li>
          <li>Better emotional literacy</li>
          <li>Community connection</li>
        </ul>
      `,
      category: "schools" as ProgramCategory,
      status: "published" as ProgramStatus,
      coverImage: "/optimized/0K0A5207.jpg",
      images: ["/optimized/0K0A5232.jpg", "/optimized/0K0A2967.jpg"],
      duration: "Single session or series",
      ageRange: "Grades 6-12",
      capacity: 30,
      price: "500.00",
      registrationRequired: true,
      requiresParentConsent: false,
      tags: ["schools", "education", "workshops"],
      faqs: [
        {
          question: "How do schools book a workshop?",
          answer: "Contact us through the event RSVP system or email directly. We'll work with you to find the best dates and customize the content."
        },
        {
          question: "Can workshops be virtual?",
          answer: "Yes! We offer both in-person and virtual workshop options to accommodate different needs."
        }
      ],
      publishedAt: new Date("2025-08-20"),
      createdAt: new Date("2025-08-10"),
      updatedAt: new Date("2025-08-20"),
    },
    {
      slug: "community-open-mic",
      title: "Community Open Mic Night",
      description: "Monthly open mic events where poets of all levels share their work in a supportive environment.",
      longDescription: `
        <p>Our monthly open mic nights are the heartbeat of the Soulworx community. Whether you're a seasoned performer or sharing your work for the first time, our open mic provides a welcoming space to express yourself.</p>
        <h3>What to Expect:</h3>
        <ul>
          <li>Supportive, judgment-free environment</li>
          <li>Featured performances from local artists</li>
          <li>5-minute performance slots (sign up starts 30 min before)</li>
          <li>Light refreshments provided</li>
          <li>Community connection and networking</li>
        </ul>
        <p>All are welcome - poets, musicians, storytellers, and appreciative audience members!</p>
      `,
      category: "community" as ProgramCategory,
      status: "published" as ProgramStatus,
      coverImage: "/optimized/0K0A2885.jpg",
      images: ["/optimized/0K0A4172.jpg", "/optimized/0K0A1830.jpg"],
      duration: "2-3 hours",
      ageRange: "All ages (minors with guardian)",
      capacity: 50,
      price: "0.00",
      registrationRequired: false,
      requiresParentConsent: false,
      tags: ["community", "open-mic", "performance", "networking"],
      faqs: [
        {
          question: "Do I need to register to perform?",
          answer: "No advance registration needed! Just arrive 30 minutes early to sign up for a performance slot."
        },
        {
          question: "Can I just come to watch?",
          answer: "Absolutely! We love having supportive audience members."
        }
      ],
      publishedAt: new Date("2025-07-01"),
      createdAt: new Date("2025-06-15"),
      updatedAt: new Date("2025-09-01"),
    },
    {
      slug: "advanced-performance-workshop",
      title: "Advanced Performance Workshop",
      description: "Intensive workshop for experienced poets looking to refine their performance skills and stage presence.",
      longDescription: `
        <p>Take your performance to the next level. This advanced workshop is designed for poets who already have a foundation in spoken word and want to develop their unique style and commanding stage presence.</p>
        <h3>Topics Covered:</h3>
        <ul>
          <li>Advanced vocal techniques and projection</li>
          <li>Body language and movement</li>
          <li>Connecting with diverse audiences</li>
          <li>Managing performance anxiety</li>
          <li>Developing your signature style</li>
          <li>Professional opportunities in spoken word</li>
        </ul>
        <p>Limited to 15 participants to ensure personalized attention.</p>
      `,
      category: "workshops" as ProgramCategory,
      status: "published" as ProgramStatus,
      coverImage: "/optimized/0K0A3003.jpg",
      images: ["/optimized/0K0A2999.jpg", "/optimized/0K0A2994.jpg"],
      duration: "2-day intensive",
      ageRange: "18+",
      capacity: 15,
      price: "150.00",
      registrationRequired: true,
      requiresParentConsent: false,
      tags: ["advanced", "performance", "professional-development"],
      faqs: [
        {
          question: "What experience level is required?",
          answer: "This workshop is for poets who have performed publicly at least 3-5 times and are comfortable with the basics of spoken word."
        }
      ],
      publishedAt: new Date("2025-09-15"),
      createdAt: new Date("2025-09-01"),
      updatedAt: new Date("2025-09-15"),
    }
  ]

  // Get or create a default admin user
  const adminEmail = "admin@soulworx.com"
  let adminUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, adminEmail)
  })

  if (!adminUser) {
    console.log("Creating default admin user...")
    const [newAdmin] = await db.insert(users).values({
      email: adminEmail,
      name: "Soulworx Admin",
      role: "admin",
      emailVerified: new Date(),
    }).returning()
    adminUser = newAdmin
    console.log("✅ Created admin user")
  }

  console.log(`Using user ID: ${adminUser.id}`)

  console.log("Creating programs...")
  const createdPrograms = await db.insert(programs).values(
    programsData.map(p => ({
      ...p,
      createdBy: adminUser!.id
    }))
  ).returning()

  console.log(`✅ Created ${createdPrograms.length} programs`)

  // Sample Events
  const eventsData = [
    // Past event
    {
      programId: createdPrograms[2].id, // Community Open Mic
      title: "September Open Mic Night",
      description: "Monthly community gathering for poets, musicians, and storytellers.",
      status: "completed" as EventStatus,
      startTime: new Date("2025-09-20T19:00:00"),
      endTime: new Date("2025-09-20T22:00:00"),
      timezone: "America/New_York",
      locationType: "in_person" as const,
      venueName: "The Poetry Lounge",
      venueAddress: "456 Arts Avenue",
      venueCity: "Brooklyn",
      venueState: "NY",
      venueZip: "11201",
      venueCountry: "USA",
      latitude: "40.6982",
      longitude: "-73.9442",
      capacity: 50,
      waitlistEnabled: false,
    },
    // Past event
    {
      programId: createdPrograms[0].id, // Youth Intensive
      title: "Youth Intensive - Fall 2025 Cohort (Completed)",
      description: "8-week intensive program - Session 1",
      status: "completed" as EventStatus,
      startTime: new Date("2025-09-15T16:00:00"),
      endTime: new Date("2025-09-15T18:00:00"),
      timezone: "America/New_York",
      locationType: "in_person" as const,
      venueName: "Soulworx Studio",
      venueAddress: "123 Creative Way",
      venueCity: "Brooklyn",
      venueState: "NY",
      venueZip: "11201",
      venueCountry: "USA",
      latitude: "40.6782",
      longitude: "-73.9442",
      capacity: 25,
      waitlistEnabled: true,
    },
    // Upcoming events
    {
      programId: createdPrograms[2].id, // Community Open Mic
      title: "October Open Mic Night",
      description: "Monthly community gathering - special Halloween edition!",
      status: "scheduled" as EventStatus,
      startTime: new Date("2025-10-25T19:00:00"),
      endTime: new Date("2025-10-25T22:00:00"),
      timezone: "America/New_York",
      locationType: "in_person" as const,
      venueName: "The Poetry Lounge",
      venueAddress: "456 Arts Avenue",
      venueCity: "Brooklyn",
      venueState: "NY",
      venueZip: "11201",
      venueCountry: "USA",
      latitude: "40.6982",
      longitude: "-73.9442",
      capacity: 50,
      waitlistEnabled: false,
    },
    {
      programId: createdPrograms[3].id, // Advanced Workshop
      title: "Advanced Performance Workshop - Fall Edition",
      description: "2-day intensive workshop for experienced spoken word artists",
      status: "scheduled" as EventStatus,
      startTime: new Date("2025-11-02T10:00:00"),
      endTime: new Date("2025-11-03T17:00:00"),
      timezone: "America/New_York",
      locationType: "in_person" as const,
      venueName: "Soulworx Studio",
      venueAddress: "123 Creative Way",
      venueCity: "Brooklyn",
      venueState: "NY",
      venueZip: "11201",
      venueCountry: "USA",
      latitude: "40.6782",
      longitude: "-73.9442",
      capacity: 15,
      waitlistEnabled: true,
    },
    {
      programId: createdPrograms[0].id, // Youth Intensive
      title: "Youth Intensive - Winter 2026 Cohort",
      description: "8-week intensive program starting January 2026",
      status: "scheduled" as EventStatus,
      startTime: new Date("2026-01-10T16:00:00"),
      endTime: new Date("2026-01-10T18:00:00"),
      timezone: "America/New_York",
      locationType: "hybrid" as const,
      venueName: "Soulworx Studio",
      venueAddress: "123 Creative Way",
      venueCity: "Brooklyn",
      venueState: "NY",
      venueZip: "11201",
      venueCountry: "USA",
      latitude: "40.6782",
      longitude: "-73.9442",
      virtualMeetingUrl: "https://zoom.us/j/soulworx-youth-intensive",
      capacity: 25,
      waitlistEnabled: true,
    },
    {
      programId: createdPrograms[1].id, // School Workshop
      title: "School Workshop - Lincoln High School",
      description: "Interactive spoken word workshop for 11th grade English classes",
      status: "scheduled" as EventStatus,
      startTime: new Date("2025-10-28T10:00:00"),
      endTime: new Date("2025-10-28T11:30:00"),
      timezone: "America/New_York",
      locationType: "in_person" as const,
      venueName: "Lincoln High School",
      venueAddress: "789 Education Blvd",
      venueCity: "Queens",
      venueState: "NY",
      venueZip: "11354",
      venueCountry: "USA",
      latitude: "40.7614",
      longitude: "-73.8236",
      capacity: 30,
      waitlistEnabled: false,
      notes: "Contact: Ms. Johnson, English Dept Head",
    },
    {
      programId: createdPrograms[2].id, // Community Open Mic
      title: "November Open Mic Night",
      description: "Monthly community gathering - Gratitude theme",
      status: "scheduled" as EventStatus,
      startTime: new Date("2025-11-22T19:00:00"),
      endTime: new Date("2025-11-22T22:00:00"),
      timezone: "America/New_York",
      locationType: "in_person" as const,
      venueName: "The Poetry Lounge",
      venueAddress: "456 Arts Avenue",
      venueCity: "Brooklyn",
      venueState: "NY",
      venueZip: "11201",
      venueCountry: "USA",
      latitude: "40.6982",
      longitude: "-73.9442",
      capacity: 50,
      waitlistEnabled: false,
    },
    {
      programId: createdPrograms[1].id, // School Workshop
      title: "Virtual Workshop - Madison Academy",
      description: "Online interactive poetry workshop for middle school students",
      status: "scheduled" as EventStatus,
      startTime: new Date("2025-11-15T13:00:00"),
      endTime: new Date("2025-11-15T14:30:00"),
      timezone: "America/New_York",
      locationType: "virtual" as const,
      virtualMeetingUrl: "https://zoom.us/j/soulworx-madison-academy",
      capacity: 30,
      waitlistEnabled: false,
      notes: "Contact: Principal Davis",
    },
  ]

  console.log("Creating events...")
  const createdEvents = await db.insert(events).values(eventsData).returning()

  console.log(`✅ Created ${createdEvents.length} events`)

  // Sample Stories/Posts
  const postsData = [
    {
      slug: "spoken-word-renaissance",
      title: "The Spoken Word Renaissance: Why Now?",
      excerpt: "Exploring the resurgence of spoken word poetry in modern culture and how it's giving voice to a new generation of storytellers.",
      content: `
        <p>In an era dominated by digital communication, spoken word poetry is experiencing an unprecedented renaissance. From viral TikTok performances to sold-out poetry slams, this ancient art form is capturing the hearts and minds of a new generation.</p>
        
        <h2>The Power of Voice</h2>
        <p>Spoken word is more than just reading poetry aloud. It's performance, emotion, rhythm, and truth intertwined. It's about using your voice as an instrument to convey meaning that transcends the written word.</p>
        
        <h2>A Platform for Change</h2>
        <p>Today's spoken word artists are using their craft to address social justice, mental health, identity, and community issues. The stage has become a platform for voices that have been historically marginalized.</p>
        
        <blockquote>"Poetry is not a luxury. It is a vital necessity of our existence." - Audre Lorde</blockquote>
        
        <h2>The Digital Stage</h2>
        <p>Social media has democratized access to poetry. Anyone with a smartphone can share their voice with millions. This accessibility has led to a diverse, vibrant community of poets worldwide.</p>
        
        <p>At Soulworx, we're proud to be part of this movement, providing spaces both physical and digital where voices can be heard, stories can be shared, and communities can be built through the power of words.</p>
      `,
      coverImage: "/optimized/0K0A2885.jpg",
      category: "poetry" as PostCategory,
      status: "published" as PostStatus,
      tags: ["poetry", "culture", "community"],
      readTime: 5,
      viewCount: 247,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-09-15"),
      createdAt: new Date("2025-09-10"),
      updatedAt: new Date("2025-09-15"),
    },
    {
      slug: "meet-jasmine-williams",
      title: "Meet Jasmine Williams: From Shy Teen to Spoken Word Champion",
      excerpt: "Jasmine's journey from writing in secret notebooks to winning regional poetry competitions is an inspiration to us all.",
      content: `
        <p>When Jasmine Williams first walked into our Youth Intensive program three years ago, she barely made eye contact. Today, she's a two-time regional poetry slam champion and a mentor to younger poets in our community.</p>
        
        <h2>Finding Her Voice</h2>
        <p>"I never thought I could perform in front of people," Jasmine shares. "I wrote poetry in secret notebooks, convinced no one would want to hear what I had to say."</p>
        
        <p>That all changed during her first open mic night at Soulworx. Despite her nerves, she stepped on stage and shared a poem about her experience as a first-generation college student.</p>
        
        <h2>The Turning Point</h2>
        <p>The response was overwhelming. "People came up to me after and said my words resonated with them. That's when I realized poetry isn't just about me - it's about connection."</p>
        
        <h2>Giving Back</h2>
        <p>Now a senior in high school, Jasmine dedicates her time to mentoring younger poets. "Someone believed in me when I couldn't believe in myself. Now I want to do the same for others."</p>
        
        <p>Jasmine's story reminds us why community matters. When we create spaces for voices to be heard, incredible transformations happen.</p>
      `,
      coverImage: "/optimized/0K0A3966 (2).jpg",
      category: "stories" as PostCategory,
      status: "published" as PostStatus,
      tags: ["community", "youth", "inspiration"],
      readTime: 4,
      viewCount: 532,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-09-20"),
      createdAt: new Date("2025-09-18"),
      updatedAt: new Date("2025-09-20"),
    },
    {
      slug: "september-open-mic-recap",
      title: "September Open Mic: A Night of Powerful Performances",
      excerpt: "Our monthly open mic brought together 50+ community members for an unforgettable evening of poetry, music, and storytelling.",
      content: `
        <p>Last Friday's open mic night was electric. The Poetry Lounge was packed with poets, musicians, storytellers, and supportive audience members, all coming together to celebrate creativity and community.</p>
        
        <h2>The Lineup</h2>
        <p>We had 15 incredible performers, ranging from first-time open mic participants to seasoned slam champions. Each brought their unique voice and perspective to the stage.</p>
        
        <h3>Standout Moments</h3>
        <ul>
          <li>Marcus Thompson's powerful piece about fatherhood had the entire room in tears</li>
          <li>The Poetry Sisters collective brought down the house with their group performance</li>
          <li>18-year-old Aisha performed for the first time and received a standing ovation</li>
        </ul>
        
        <h2>Community in Action</h2>
        <p>What makes our open mics special isn't just the performances - it's the community we've built. Between sets, people were connecting, exchanging Instagram handles, and making plans to collaborate.</p>
        
        <blockquote>"This is my favorite night of the month. Where else can you be completely yourself and have people celebrate that?" - Regular attendee</blockquote>
        
        <h2>Join Us Next Month</h2>
        <p>Our next open mic is October 25th. Whether you're ready to perform or just want to support, we'd love to see you there. Sign-ups start at 6:30 PM, show starts at 7 PM.</p>
      `,
      coverImage: "/optimized/0K0A4950.jpg",
      category: "news" as PostCategory,
      status: "published" as PostStatus,
      tags: ["events", "open-mic", "community"],
      readTime: 3,
      viewCount: 189,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-09-22"),
      createdAt: new Date("2025-09-21"),
      updatedAt: new Date("2025-09-22"),
    },
    {
      slug: "brooklyn-magazine-feature",
      title: "Soulworx Featured in Brooklyn Magazine's 'Arts & Culture' Issue",
      excerpt: "Brooklyn Magazine highlights Soulworx's impact on the local arts community in their latest feature article.",
      content: `
        <p><strong>FOR IMMEDIATE RELEASE</strong></p>
        <p>Brooklyn, NY - September 25, 2025</p>
        
        <p>Soulworx is proud to announce our feature in Brooklyn Magazine's October 2025 "Arts & Culture" issue. The article highlights our work in providing accessible arts programming to Brooklyn's youth and communities.</p>
        
        <h2>From the Article</h2>
        <blockquote>"In a borough known for its vibrant arts scene, Soulworx stands out by making spoken word poetry accessible to everyone, regardless of background or experience level." - Brooklyn Magazine</blockquote>
        
        <p>The feature includes interviews with program participants, photos from recent events, and an overview of our mission to use poetry as a tool for community building and social change.</p>
        
        <h2>Recognition of Impact</h2>
        <p>The article specifically highlights:</p>
        <ul>
          <li>Our Youth Intensive program's success in building confidence and communication skills</li>
          <li>Partnerships with local schools reaching 500+ students annually</li>
          <li>Monthly open mics that have become a staple of Brooklyn's arts calendar</li>
          <li>Our commitment to keeping all youth programming free and accessible</li>
        </ul>
        
        <h2>Looking Forward</h2>
        <p>"This recognition from Brooklyn Magazine validates what we've always known - that there's a hunger for authentic, community-driven arts programming," says Soulworx founder. "But we're just getting started."</p>
        
        <h2>Media Contact</h2>
        <p>For press inquiries, interviews, or high-resolution images, please contact:<br>
        Email: press@soulworx.com<br>
        Phone: (555) 123-4567</p>
      `,
      coverImage: "/optimized/0K0A7770.jpg",
      category: "announcements" as PostCategory,
      status: "published" as PostStatus,
      tags: ["press", "media", "recognition"],
      readTime: 3,
      viewCount: 421,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-09-25"),
      createdAt: new Date("2025-09-25"),
      updatedAt: new Date("2025-09-25"),
    }
  ]

  console.log("Creating stories/posts...")
  const createdPosts = await db.insert(posts).values(postsData).returning()
  console.log(`✅ Created ${createdPosts.length} stories`)

  // Sample Products for Shop
  const productsData = [
    {
      name: "SoulWorx Original Tee",
      slug: "soulworx-original-tee",
      description: "Express yourself with our signature SoulWorx t-shirt. Soft, comfortable, and stylish.",
      category: "apparel" as const,
      status: "active" as const,
      price: "29.99",
      compareAtPrice: "39.99",
      images: ["/shop/placeholder.webp"],
      stock: 50,
      sku: "SW-TEE-001",
      trackInventory: true,
      tags: ["tshirt", "apparel", "signature"],
      specifications: {
        Material: "100% Cotton",
        Fit: "Regular",
        Care: "Machine wash cold",
      } as const,
      createdBy: adminUser!.id,
    },
    {
      name: "Poetry Journal",
      slug: "poetry-journal",
      description: "A beautiful hardcover journal for capturing your thoughts and poetry. 200 pages of premium paper.",
      category: "accessories" as const,
      status: "active" as const,
      price: "24.99",
      images: ["/shop/placeholder.webp"],
      stock: 30,
      sku: "SW-JNL-001",
      trackInventory: true,
      tags: ["journal", "writing", "poetry"],
      specifications: {
        Pages: "200",
        Size: "6x9 inches",
        Cover: "Hardcover",
        Paper: "Premium acid-free",
      } as const,
      createdBy: adminUser!.id,
    },
    {
      name: "SoulWorx Hoodie",
      slug: "soulworx-hoodie",
      description: "Stay warm and inspired with our premium pullover hoodie. Perfect for creative souls.",
      category: "apparel" as const,
      status: "active" as const,
      price: "54.99",
      compareAtPrice: "69.99",
      images: ["/shop/placeholder.webp"],
      stock: 25,
      sku: "SW-HOD-001",
      trackInventory: true,
      tags: ["hoodie", "apparel", "winter"],
      specifications: {
        Material: "80% Cotton, 20% Polyester",
        Fit: "Regular",
        Features: "Kangaroo pocket, drawstring hood",
      } as const,
      createdBy: adminUser!.id,
    },
    {
      name: "Words That Walk Tote",
      slug: "words-that-walk-tote",
      description: "Carry your essentials in style with our eco-friendly canvas tote bag.",
      category: "accessories" as const,
      status: "active" as const,
      price: "19.99",
      images: ["/shop/placeholder.webp"],
      stock: 100,
      sku: "SW-TOT-001",
      trackInventory: true,
      tags: ["tote", "bag", "accessories"],
      specifications: {
        Material: "100% Organic Cotton Canvas",
        Size: "15x16 inches",
        Capacity: "Large",
      } as const,
      createdBy: adminUser!.id,
    },
    {
      name: "Limited Edition Poetry Book",
      slug: "limited-edition-poetry-book",
      description: "A curated collection of poetry from SoulWorx community members. Limited edition, hardcover.",
      category: "books" as const,
      status: "active" as const,
      price: "34.99",
      images: ["/shop/placeholder.webp"],
      stock: 15,
      sku: "SW-BK-001",
      trackInventory: true,
      tags: ["book", "poetry", "limited edition"],
      specifications: {
        Pages: "150",
        Format: "Hardcover",
        ISBN: "978-1-234567-89-0",
        Edition: "Limited First Edition",
      } as const,
      createdBy: adminUser!.id,
    },
    {
      name: "SoulWorx Sticker Pack",
      slug: "soulworx-sticker-pack",
      description: "Express yourself everywhere with our premium vinyl sticker pack. 10 unique designs.",
      category: "accessories" as const,
      status: "active" as const,
      price: "12.99",
      images: ["/shop/placeholder.webp"],
      stock: 200,
      sku: "SW-STK-001",
      trackInventory: true,
      tags: ["stickers", "accessories", "pack"],
      specifications: {
        Quantity: "10 stickers",
        Material: "Premium vinyl",
        Size: "Various (2-4 inches)",
        Finish: "Glossy, waterproof",
      } as const,
      createdBy: adminUser!.id,
    },
    {
      name: "Virtual Workshop Pass",
      slug: "virtual-workshop-pass",
      description: "Get access to all virtual poetry workshops for one month. Learn from experienced poets.",
      category: "digital" as const,
      status: "active" as const,
      price: "49.99",
      images: ["/shop/placeholder.webp"],
      stock: 999,
      sku: "SW-DIG-001",
      trackInventory: false,
      tags: ["digital", "workshop", "education"],
      specifications: {
        Duration: "30 days",
        Access: "All virtual workshops",
        Includes: "Recordings and materials",
      } as const,
      createdBy: adminUser!.id,
    },
    {
      name: "SoulWorx Baseball Cap",
      slug: "soulworx-baseball-cap",
      description: "Classic baseball cap with embroidered SoulWorx logo. Adjustable strap for perfect fit.",
      category: "apparel" as const,
      status: "active" as const,
      price: "24.99",
      images: ["/shop/placeholder.webp"],
      stock: 40,
      sku: "SW-CAP-001",
      trackInventory: true,
      tags: ["cap", "hat", "apparel"],
      specifications: {
        Material: "100% Cotton twill",
        Closure: "Adjustable strap",
        Logo: "Embroidered",
      } as const,
      createdBy: adminUser!.id,
    },
  ]

  console.log("Creating shop products...")
  const createdProducts = await db.insert(products).values(productsData).returning()
  console.log(`✅ Created ${createdProducts.length} products`)

  console.log("\n🎉 Seeding complete!")
  console.log("\n📊 Summary:")
  console.log(`   - ${createdPrograms.length} programs`)
  console.log(`   - ${createdEvents.length} events`)
  console.log(`   - ${createdPosts.length} stories`)
  console.log(`   - ${createdProducts.length} products`)
  console.log("\n📝 Next steps:")
  console.log("1. Sign in with OAuth (Google, Discord, or Apple)")
  console.log("2. Run this SQL to make yourself admin:")
  console.log("   UPDATE \"user\" SET role = 'admin' WHERE email = 'your-email@example.com';")
  console.log("3. Visit /shop to see your products!")
  console.log("4. Visit /dashboard/admin/shop to manage products")
  
  process.exit(0)
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error)
  process.exit(1)
})


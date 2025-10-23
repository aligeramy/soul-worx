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
  const adminEmail = "Indianarotondo@soulworx.ca"
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
    console.log("Created admin user")
  }

  console.log(`Using user ID: ${adminUser.id}`)

  console.log("Creating programs...")
  const createdPrograms = await db.insert(programs).values(
    programsData.map(p => ({
      ...p,
      createdBy: adminUser!.id
    }))
  ).returning()

  console.log(`Created ${createdPrograms.length} programs`)

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

  console.log(`Created ${createdEvents.length} events`)

  // Sample Stories/Posts - Multiple for each category
  const postsData = [
    // POETRY DROPS (3 stories)
    {
      slug: "whispers-of-the-city",
      title: "Whispers of the City",
      excerpt: "A poetic journey through Brooklyn's streets, where every corner tells a story and every voice matters.",
      content: `
        <p>The city breathes in rhythm,<br>
        Concrete lungs expanding with each dawn,<br>
        Exhaling stories through subway grates,<br>
        Where dreams and reality dance as one.</p>
        
        <p>I walk these streets like pages,<br>
        Each block a verse, each corner a stanza,<br>
        Reading the poetry written in graffiti,<br>
        In the eyes of strangers passing by.</p>
        
        <blockquote>
        "We are all poets in this urban symphony,<br>
        Our footsteps the meter, our voices the rhyme."
        </blockquote>
        
        <p>The bodega owner knows my name,<br>
        The street musician plays my heartbeat,<br>
        The old woman on the stoop<br>
        Holds centuries of wisdom in her smile.</p>
        
        <p>This is where I learned to listen,<br>
        To the whispers between car horns,<br>
        To the silence in crowded trains,<br>
        To the poetry that lives in everyday moments.</p>
        
        <p>Brooklyn taught me that every voice<br>
        Is a verse in the city's endless poem,<br>
        And we are all co-authors<br>
        Of this beautiful, chaotic masterpiece.</p>
      `,
      coverImage: "/optimized/0K0A4950.jpg",
      category: "poetry" as PostCategory,
      status: "published" as PostStatus,
      tags: ["poetry", "urban", "brooklyn", "community"],
      readTime: 3,
      viewCount: 342,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-10-05"),
      createdAt: new Date("2025-10-03"),
      updatedAt: new Date("2025-10-05"),
    },
    {
      slug: "mothers-hands",
      title: "Mother's Hands",
      excerpt: "A tribute to the strength, love, and resilience carried in the hands that raised us.",
      content: `
        <p>I remember my mother's hands,<br>
        How they moved like prayers through the air,<br>
        Braiding my hair with patience,<br>
        Kneading dough with love.</p>
        
        <p>Those hands that worked three jobs,<br>
        Yet never forgot to tuck me in,<br>
        Calloused from labor,<br>
        Soft with tenderness.</p>
        
        <blockquote>
        "In her hands, I saw the whole world—<br>
        Its struggles, its beauty, its infinite capacity for love."
        </blockquote>
        
        <p>She taught me that strength<br>
        Isn't always loud or visible,<br>
        Sometimes it's in the quiet moments,<br>
        The gentle touch, the steady presence.</p>
        
        <p>Now I look at my own hands,<br>
        See her legacy in every line,<br>
        And I understand that we carry<br>
        More than we know in our palms.</p>
        
        <p>These hands that type and text,<br>
        That reach out and hold on,<br>
        They remember the lessons<br>
        Written in my mother's touch.</p>
      `,
      coverImage: "/optimized/0K0A3966 (2).jpg",
      category: "poetry" as PostCategory,
      status: "published" as PostStatus,
      tags: ["poetry", "family", "love", "tribute"],
      readTime: 3,
      viewCount: 528,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-09-28"),
      createdAt: new Date("2025-09-26"),
      updatedAt: new Date("2025-09-28"),
    },
    {
      slug: "spoken-word-renaissance",
      title: "The Spoken Word Renaissance",
      excerpt: "Exploring the resurgence of spoken word poetry in modern culture and how it's giving voice to a new generation.",
      content: `
        <p>In an era dominated by digital communication,<br>
        Spoken word poetry is experiencing<br>
        An unprecedented renaissance.</p>
        
        <p>From viral TikTok performances<br>
        To sold-out poetry slams,<br>
        This ancient art form is capturing<br>
        The hearts and minds of a new generation.</p>
        
        <h2>The Power of Voice</h2>
        
        <p>Spoken word is more than reading aloud,<br>
        It's performance, emotion, rhythm, truth,<br>
        Using your voice as an instrument<br>
        To convey meaning beyond words.</p>
        
        <blockquote>"Poetry is not a luxury. It is a vital necessity of our existence." - Audre Lorde</blockquote>
        
        <h2>A Platform for Change</h2>
        
        <p>Today's spoken word artists<br>
        Address social justice, mental health,<br>
        Identity, and community issues,<br>
        The stage a platform for marginalized voices.</p>
        
        <p>At Soulworx, we're proud to be part of this movement,<br>
        Providing spaces where voices can be heard,<br>
        Stories can be shared,<br>
        And communities built through the power of words.</p>
      `,
      coverImage: "/optimized/0K0A2885.jpg",
      category: "poetry" as PostCategory,
      status: "published" as PostStatus,
      tags: ["poetry", "culture", "community", "social-change"],
      readTime: 4,
      viewCount: 247,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-09-15"),
      createdAt: new Date("2025-09-10"),
      updatedAt: new Date("2025-09-15"),
    },
    // COMMUNITY HIGHLIGHTS (3 stories)
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
      slug: "marcus-journey-to-healing",
      title: "Marcus's Journey: Finding Healing Through Poetry",
      excerpt: "After years of struggling with trauma, Marcus discovered that spoken word poetry could be a path to healing and self-discovery.",
      content: `
        <p>Marcus Thompson sat in the back row of his first Soulworx workshop, arms crossed, skeptical. "I'm not a poet," he told himself. "I'm just here because my therapist suggested it."</p>
        
        <h2>Breaking the Silence</h2>
        <p>For years, Marcus carried the weight of childhood trauma in silence. Traditional therapy helped, but something was still missing—a way to express the emotions that felt too big for regular conversation.</p>
        
        <p>"The first time I wrote a poem about my father, I couldn't stop crying," Marcus shares. "But it was different from other times I'd cried. This felt like release, like I was finally letting go of something I'd been holding onto for decades."</p>
        
        <blockquote>"Poetry gave me permission to feel everything without judgment. On that stage, my pain became power."</blockquote>
        
        <h2>The Power of Community</h2>
        <p>What surprised Marcus most wasn't just the writing—it was the community. "When I performed my first piece at open mic, people came up to me afterward and said, 'Me too.' I realized I wasn't alone."</p>
        
        <p>Now, two years later, Marcus is a regular performer and has started mentoring other men in the community who are working through their own trauma.</p>
        
        <h2>A Message of Hope</h2>
        <p>"If you're reading this and you're hurting, know that there's a space for you here," Marcus says. "Your story matters. Your voice matters. And sometimes, the bravest thing you can do is speak your truth out loud."</p>
        
        <p>Marcus's journey reminds us that healing isn't linear, and sometimes the most powerful medicine comes from community, creativity, and the courage to be vulnerable.</p>
      `,
      coverImage: "/optimized/0K0A5119.jpg",
      category: "stories" as PostCategory,
      status: "published" as PostStatus,
      tags: ["community", "healing", "mental-health", "inspiration"],
      readTime: 5,
      viewCount: 687,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-10-08"),
      createdAt: new Date("2025-10-06"),
      updatedAt: new Date("2025-10-08"),
    },
    {
      slug: "sisters-of-the-mic",
      title: "The Poetry Sisters: Building Sisterhood Through Spoken Word",
      excerpt: "How three strangers became sisters through their shared love of poetry and created a collective that's changing the game.",
      content: `
        <p>They met at a Soulworx open mic three years ago—three women from different backgrounds, different ages, different stories. But when they each performed that night, they recognized something in each other: a fierce authenticity, a refusal to be silenced, a commitment to truth-telling.</p>
        
        <h2>From Solo Artists to Collective</h2>
        <p>Aisha, Carmen, and Destiny started meeting weekly to write and workshop their pieces. What began as casual collaboration evolved into something deeper—a sisterhood built on mutual support, honest feedback, and unconditional love.</p>
        
        <p>"We push each other to be better," says Carmen. "But we also hold each other when the work gets too heavy. Poetry can bring up a lot, and having sisters who understand that is everything."</p>
        
        <blockquote>"We're not just a collective—we're a family. We celebrate each other's wins and carry each other through the losses."</blockquote>
        
        <h2>Creating Space for Others</h2>
        <p>The Poetry Sisters have become fixtures in the Soulworx community, known for their powerful group performances and their commitment to uplifting other women poets.</p>
        
        <p>"We remember what it felt like to be new, to be scared to share our work," Destiny explains. "So we make it our mission to create the kind of supportive space we wish we'd had."</p>
        
        <h2>The Ripple Effect</h2>
        <p>Their influence extends beyond the stage. They've started a monthly women's writing circle, mentored dozens of young poets, and inspired other collectives to form.</p>
        
        <p>"The best part is watching other women find their voices and their people," Aisha says. "That's the real magic—not just what we create, but what we inspire others to create."</p>
        
        <p>The Poetry Sisters prove that when women support women, everyone rises.</p>
      `,
      coverImage: "/optimized/0K0A3921.jpg",
      category: "stories" as PostCategory,
      status: "published" as PostStatus,
      tags: ["community", "women", "collaboration", "sisterhood"],
      readTime: 5,
      viewCount: 892,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-10-12"),
      createdAt: new Date("2025-10-10"),
      updatedAt: new Date("2025-10-12"),
    },
    
    // EVENT RECAPS (3 stories)
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
      slug: "youth-intensive-summer-showcase",
      title: "Youth Intensive Summer Showcase: A Celebration of Young Voices",
      excerpt: "25 young poets took the stage to share their truth, their pain, and their hope in a powerful evening of spoken word.",
      content: `
        <p>The energy in the room was palpable as families, friends, and community members filled every seat for the Youth Intensive Summer Showcase. After eight weeks of intensive workshops, 25 young poets were ready to share their voices with the world.</p>
        
        <h2>A Journey of Transformation</h2>
        <p>The showcase wasn't just a performance—it was a celebration of growth. Many of these young people had never performed in public before. Some had never even shared their writing with anyone.</p>
        
        <p>"Watching them step onto that stage, owning their stories, speaking their truth—that's what this program is all about," said program director Maria Santos.</p>
        
        <h2>Standout Performances</h2>
        <ul>
          <li>Destiny's powerful piece about identity and belonging brought the audience to tears</li>
          <li>Carlos performed a bilingual poem honoring his grandmother that received a standing ovation</li>
          <li>The group piece "We Are Brooklyn" showcased the collaborative spirit of the cohort</li>
          <li>Shy freshman Maya closed the show with a poem about finding her voice</li>
        </ul>
        
        <blockquote>"I came into this program thinking I had nothing to say. I'm leaving knowing my voice matters." - Participant</blockquote>
        
        <h2>The Impact</h2>
        <p>Beyond the performances, the showcase highlighted the transformative power of arts education. Parents shared how they'd watched their children grow in confidence. Teachers noted improvements in communication skills and self-expression.</p>
        
        <p>But perhaps most importantly, the young poets themselves spoke about finding community, discovering their voices, and learning that their stories matter.</p>
        
        <h2>Looking Ahead</h2>
        <p>The fall cohort of the Youth Intensive program begins in October. Applications are now open for young people ages 13-18 who want to explore spoken word poetry in a supportive, creative environment.</p>
        
        <p>As one participant put it: "This program didn't just teach me poetry. It taught me that I have something worth saying, and people who want to hear it."</p>
      `,
      coverImage: "/optimized/0K0A4102.jpg",
      category: "news" as PostCategory,
      status: "published" as PostStatus,
      tags: ["events", "youth", "showcase", "education"],
      readTime: 4,
      viewCount: 456,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-08-15"),
      createdAt: new Date("2025-08-14"),
      updatedAt: new Date("2025-08-15"),
    },
    {
      slug: "poetry-in-the-park-recap",
      title: "Poetry in the Park: Community Comes Together for Outdoor Celebration",
      excerpt: "Beautiful weather, powerful performances, and community connection made our first outdoor poetry event an unforgettable success.",
      content: `
        <p>Under the shade of Brooklyn's oldest oak trees, over 100 community members gathered for Soulworx's first-ever Poetry in the Park event. What started as an experiment in outdoor programming became a beautiful celebration of art, community, and connection.</p>
        
        <h2>A Perfect Day</h2>
        <p>The weather couldn't have been better—sunny skies, a gentle breeze, and temperatures in the mid-70s. Families spread blankets on the grass, kids played nearby, and the atmosphere was relaxed yet electric with anticipation.</p>
        
        <p>"There's something special about poetry outdoors," said featured performer James Rodriguez. "The natural setting reminds us that art isn't confined to stages and theaters—it's everywhere, for everyone."</p>
        
        <h2>Performances That Moved Us</h2>
        <p>The afternoon featured 20 performers ranging from seasoned slam champions to first-time poets. Highlights included:</p>
        
        <ul>
          <li>A group of elementary school students who performed original poems about nature</li>
          <li>Elder poet Mrs. Johnson sharing wisdom from 50 years of writing</li>
          <li>The Poetry Sisters' powerful piece about community resilience</li>
          <li>An impromptu cypher that had the crowd on their feet</li>
        </ul>
        
        <blockquote>"Poetry in the park reminded me why I fell in love with this art form—it's about bringing people together." - Attendee</blockquote>
        
        <h2>More Than Just Poetry</h2>
        <p>The event also featured local food vendors, a community art wall where attendees could share their own verses, and a kids' corner with poetry-themed activities.</p>
        
        <p>"We wanted to create an event that was accessible and welcoming to everyone," explained event organizer Keisha Williams. "Poetry can sometimes feel exclusive, but today showed that it belongs to all of us."</p>
        
        <h2>Making It Annual</h2>
        <p>Due to overwhelming positive feedback, Soulworx has announced that Poetry in the Park will become an annual event. Mark your calendars for next summer!</p>
        
        <p>As the sun set and the last poet took the mic, the crowd spontaneously began snapping—the poet's applause—creating a sound like rain on leaves. It was the perfect ending to a perfect day.</p>
      `,
      coverImage: "/optimized/0K0A5207.jpg",
      category: "news" as PostCategory,
      status: "published" as PostStatus,
      tags: ["events", "community", "outdoor", "celebration"],
      readTime: 4,
      viewCount: 623,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-07-20"),
      createdAt: new Date("2025-07-19"),
      updatedAt: new Date("2025-07-20"),
    },
    
    // PRESS & MEDIA (3 stories)
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
        Email: Indianarotondo@soulworx.ca<br>
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
    },
    {
      slug: "grant-award-announcement",
      title: "Soulworx Receives $50,000 Grant to Expand Youth Programming",
      excerpt: "The National Endowment for the Arts awards Soulworx funding to bring spoken word poetry to underserved communities.",
      content: `
        <p><strong>FOR IMMEDIATE RELEASE</strong></p>
        <p>Brooklyn, NY - October 10, 2025</p>
        
        <p>Soulworx is proud to announce that we have been awarded a $50,000 grant from the National Endowment for the Arts (NEA) to expand our youth spoken word programming in underserved Brooklyn communities.</p>
        
        <h2>About the Grant</h2>
        <p>This grant will enable Soulworx to:</p>
        <ul>
          <li>Launch three new Youth Intensive cohorts in underserved neighborhoods</li>
          <li>Provide free workshops in 10 additional schools</li>
          <li>Create a mentorship program pairing experienced poets with emerging young voices</li>
          <li>Develop a digital archive of student work and performances</li>
          <li>Host quarterly community showcases celebrating youth voices</li>
        </ul>
        
        <blockquote>"This grant represents a major milestone for Soulworx and, more importantly, for the young people we serve. It will allow us to reach communities that have historically had limited access to arts programming." - Soulworx Executive Director</blockquote>
        
        <h2>Impact on the Community</h2>
        <p>The expanded programming is expected to serve an additional 200 young people annually, with a focus on communities where arts education funding has been cut or is non-existent.</p>
        
        <p>"Every young person deserves access to creative expression and a platform for their voice," said Program Director Maria Santos. "This grant helps us move closer to that vision."</p>
        
        <h2>About the National Endowment for the Arts</h2>
        <p>The NEA is an independent federal agency that funds, promotes, and strengthens the creative capacity of our communities by providing all Americans with diverse opportunities for arts participation.</p>
        
        <h2>Looking Ahead</h2>
        <p>Programming expansion will begin in January 2026. Schools and community organizations interested in partnering with Soulworx are encouraged to reach out.</p>
        
        <h2>Media Contact</h2>
        <p>For press inquiries, interviews, or additional information:<br>
        Email: Indianarotondo@soulworx.ca<br>
        Phone: (555) 123-4567<br>
        Website: www.soulworx.com</p>
      `,
      coverImage: "/optimized/0K0A7770.jpg",
      category: "announcements" as PostCategory,
      status: "published" as PostStatus,
      tags: ["press", "grant", "funding", "expansion"],
      readTime: 3,
      viewCount: 789,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-10-10"),
      createdAt: new Date("2025-10-10"),
      updatedAt: new Date("2025-10-10"),
    },
    {
      slug: "partnership-announcement-nyc-schools",
      title: "Soulworx Partners with NYC Department of Education for Citywide Poetry Initiative",
      excerpt: "New partnership will bring spoken word workshops to 50 NYC public schools, reaching over 5,000 students.",
      content: `
        <p><strong>FOR IMMEDIATE RELEASE</strong></p>
        <p>Brooklyn, NY - October 15, 2025</p>
        
        <p>Soulworx and the New York City Department of Education today announced a groundbreaking partnership to bring spoken word poetry programming to 50 public schools across all five boroughs, reaching an estimated 5,000 students in the 2025-2026 school year.</p>
        
        <h2>Partnership Details</h2>
        <p>The initiative, titled "Every Voice Matters," will provide:</p>
        <ul>
          <li>Weekly spoken word workshops during school hours</li>
          <li>Professional development for teachers on integrating poetry into curriculum</li>
          <li>Quarterly school-based showcases and competitions</li>
          <li>A citywide poetry slam championship in June 2026</li>
          <li>Free resources and curriculum materials for participating schools</li>
        </ul>
        
        <blockquote>"This partnership represents a commitment to ensuring that every NYC student has access to arts education that develops critical thinking, communication skills, and creative expression." - NYC Schools Chancellor</blockquote>
        
        <h2>Why Spoken Word?</h2>
        <p>Research shows that spoken word poetry education improves:</p>
        <ul>
          <li>Literacy and language arts skills</li>
          <li>Public speaking confidence</li>
          <li>Critical thinking and analytical abilities</li>
          <li>Social-emotional learning</li>
          <li>Cultural awareness and empathy</li>
        </ul>
        
        <p>"Spoken word gives students a voice and a platform," explains Soulworx founder. "It teaches them that their stories matter, their perspectives are valuable, and they have the power to create change through their words."</p>
        
        <h2>Selection Process</h2>
        <p>The 50 participating schools were selected based on criteria including:</p>
        <ul>
          <li>Limited existing arts programming</li>
          <li>High percentage of students from underserved communities</li>
          <li>Strong administrative support for arts integration</li>
          <li>Diverse student populations</li>
        </ul>
        
        <h2>Community Impact</h2>
        <p>This partnership builds on Soulworx's decade-long history of school-based programming and represents a significant expansion of our reach and impact.</p>
        
        <p>"We've seen firsthand how spoken word transforms students," said Program Director Maria Santos. "This partnership allows us to bring that transformation to thousands more young people across the city."</p>
        
        <h2>About Soulworx</h2>
        <p>Soulworx is a Brooklyn-based nonprofit organization dedicated to using spoken word poetry as a tool for community building, youth development, and social change. Since 2015, we've served over 10,000 community members through workshops, performances, and events.</p>
        
        <h2>Media Contact</h2>
        <p>Soulworx:<br>
        Email: Indianarotondo@soulworx.ca<br>
        Phone: (555) 123-4567</p>
        
        <p>NYC Department of Education:<br>
        Email: press@schools.nyc.gov<br>
        Phone: (212) 555-0100</p>
      `,
      coverImage: "/optimized/0K0A5232.jpg",
      category: "announcements" as PostCategory,
      status: "published" as PostStatus,
      tags: ["press", "partnership", "education", "nyc"],
      readTime: 4,
      viewCount: 1243,
      authorId: adminUser!.id,
      publishedAt: new Date("2025-10-15"),
      createdAt: new Date("2025-10-15"),
      updatedAt: new Date("2025-10-15"),
    }
  ]

  console.log("Creating stories/posts...")
  const createdPosts = await db.insert(posts).values(postsData).returning()
  console.log(`Created ${createdPosts.length} stories`)

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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
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
      },
      createdBy: adminUser!.id,
    },
  ]

  console.log("Creating shop products...")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createdProducts = await db.insert(products).values(productsData as any).returning()
  console.log(`Created ${createdProducts.length} products`)

  console.log("\nSeeding complete!")
  console.log("\nSummary:")
  console.log(`   - ${createdPrograms.length} programs`)
  console.log(`   - ${createdEvents.length} events`)
  console.log(`   - ${createdPosts.length} stories (3 Poetry, 3 Community, 3 Events, 3 Press)`)
  console.log(`   - ${createdProducts.length} products`)
  console.log("\nStory Categories:")
  console.log("   Poetry Drops: Beautiful verse-by-verse animations")
  console.log("   Blog: Latest insights and stories")
  console.log("   Event Recaps: Animated stats & photo galleries")
  console.log("   Press & Media: Professional news layouts")
  console.log("\nNext steps:")
  console.log("1. Sign in with OAuth (Google, Discord, or Apple)")
  console.log("2. Run this SQL to make yourself admin:")
  console.log("   UPDATE \"user\" SET role = 'admin' WHERE email = 'your-email@example.com';")
  console.log("3. Visit /stories/poetry, /stories/blog, /stories/events, or /stories/press")
  console.log("4. Visit /dashboard/admin/stories to create new stories with category-specific guidance!")
  console.log("5. Each story type has unique animations powered by Framer Motion")
  
  process.exit(0)
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error)
  process.exit(1)
})


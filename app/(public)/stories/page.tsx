import { CategoryCard } from "@/components/ui/category-card"
import Image from "next/image"
import { getPublishedPosts } from "@/lib/db/queries"
import { Clock } from "lucide-react"
import { PoetryCard } from "@/components/stories/poetry-card"
import { AnnouncementCard } from "@/components/stories/announcement-card"
import { BlogCard } from "@/components/stories/blog-card"
import { MasonryGrid } from "@/components/stories/masonry-grid"

export default async function StoriesPage() {
  const posts = await getPublishedPosts()
  const categories = [
    {
      title: "Blog",
      description: "Latest insights and stories",
      href: "/stories/blog",
      image: "/optimized/0K0A3966 (2).jpg"
    },
    {
      title: "Poetry Drops",
      description: "Latest poetic expressions and releases",
      href: "/stories/poetry",
      image: "/optimized/0K0A2885.jpg"
    },
    {
      title: "Event Recaps",
      description: "Highlights from past workshops and gatherings",
      href: "/stories/events",
      image: "/optimized/0K0A4950.jpg"
    },
    {
      title: "Press & Media",
      description: "Media coverage and press releases",
      href: "/stories/press",
      image: "/optimized/0K0A7770.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/optimized/0K0A2992.jpg"
          alt="Stories"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-white/80 mb-2 text-sm font-bold uppercase tracking-wider">
              STORIES
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Share The Journey
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Celebrating voices, moments, and the power of community
            </p>
          </div>
        </div>
      </section>

      {/* Category Cards Grid - Single Row */}
      <section className="relative z-0 px-6 pt-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-8">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.href}
                {...category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="relative overflow-hidden px-6 pb-32 pt-16">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0">
          <Image
            src="/optimized/0K0A0798.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-neutral-50/95 to-neutral-50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-6 h-6 text-neutral-400" />
            <h2 className="text-3xl font-crimson font-normal tracking-tighter">Latest Stories</h2>
          </div>
          
          {posts.length > 0 ? (
            <MasonryGrid>
              {posts.slice(0, 6).map((post) => {
                // Render different card types based on category
                if (post.category === "poetry") {
                  return <PoetryCard key={post.id} post={post} />
                }
                
                if (post.category === "announcements") {
                  return <AnnouncementCard key={post.id} post={post} />
                }
                
                // Default to blog card for all other categories
                return <BlogCard key={post.id} post={post} />
              })}
            </MasonryGrid>
          ) : (
            <div className="text-center py-16 text-neutral-500">
              <p className="text-lg">No stories yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


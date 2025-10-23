import { CategoryCard } from "@/components/ui/category-card"
import Image from "next/image"

export default function StoriesPage() {
  const categories = [
    {
      title: "Poetry Drops",
      description: "Latest poetic expressions and releases",
      href: "/stories/poetry",
      image: "/optimized/0K0A2885.jpg"
    },
    {
      title: "Blog",
      description: "Latest insights and stories",
      href: "/stories/blog",
      image: "/optimized/0K0A3966 (2).jpg"
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

      {/* Category Cards Grid */}
      <section className="relative z-0 pb-32 px-6 pt-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-8">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    </div>
  )
}


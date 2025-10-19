import { CategoryCard } from "@/components/ui/category-card"

export default function StoriesPage() {
  const categories = [
    {
      title: "Poetry Drops",
      description: "Latest poetic expressions and releases",
      href: "/stories/poetry",
      image: "/optimized/0K0A2885.jpg"
    },
    {
      title: "Community Highlights",
      description: "Stories from our creative community",
      href: "/stories/community",
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
    <div className="min-h-screen bg-brand-bg-darker relative">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url('/noise.png')`,
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Modern Header */}
      <section className="relative z-0 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full">
              STORIES
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 text-white">
            Share The
            <br />
            <span className="text-gold">
              Journey
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl font-light">
            Celebrating voices, moments, and the power of community
          </p>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="relative z-0 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">Explore by Category</h2>
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


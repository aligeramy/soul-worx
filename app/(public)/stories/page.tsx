import { CategoryCard } from "@/components/ui/category-card"
import Image from "next/image"
import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"
import { Clock, BookOpen, Heart, Calendar, Newspaper } from "lucide-react"

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 6).map((post) => {
                // Get icon based on category
                const getCategoryIcon = (category: string) => {
                  switch (category) {
                    case 'blog':
                      return <BookOpen className="w-4 h-4" />
                    case 'poetry':
                      return <Heart className="w-4 h-4" />
                    case 'events':
                      return <Calendar className="w-4 h-4" />
                    case 'press':
                      return <Newspaper className="w-4 h-4" />
                    default:
                      return <BookOpen className="w-4 h-4" />
                  }
                }

                return (
                  <Link 
                    key={post.id} 
                    href={`/stories/${post.category}/${post.slug}`}
                    className="group block"
                  >
                    <article className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-neutral-100">
                      {/* Image */}
                      {post.coverImage && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Multi-layer gradient for richer effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
                          
                          {/* Category Badge with Icon */}
                          <div className="absolute top-4 left-4">
                            <span className="flex items-center gap-2 px-4 py-1.5 bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/50">
                              {getCategoryIcon(post.category)}
                              {post.category}
                            </span>
                          </div>

                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                          </div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-6 bg-gradient-to-b from-white to-neutral-50/50">
                        <h3 className="text-xl font-crimson font-normal tracking-tight text-neutral-900 mb-3 group-hover:text-neutral-700 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2 mb-5">
                            {post.excerpt}
                          </p>
                        )}
                        
                        {/* Meta */}
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                          <div className="flex items-center gap-3 text-xs text-neutral-500">
                            {post.publishedAt && (
                              <time dateTime={post.publishedAt.toISOString()} className="font-medium">
                                {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </time>
                            )}
                            {post.author && (
                              <>
                                <span className="text-neutral-300">•</span>
                                <span className="font-medium">{post.author.name}</span>
                              </>
                            )}
                          </div>
                          
                          {/* Arrow indicator */}
                          <div className="text-neutral-400 group-hover:text-neutral-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
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


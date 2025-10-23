import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, FileText } from "lucide-react"

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  const blogPosts = posts.filter(p => p.category === "blog")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/optimized/0K0A3966 (2).jpg"
          alt="Blog"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/stories" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Stories
            </Link>
            
            <div className="text-white/80 mb-2 text-sm font-bold uppercase tracking-wider">
              BLOG
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Latest Insights
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Stories, thoughts, and reflections from our journey
            </p>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="relative z-0 pb-32 px-6 pt-16 bg-white">
        <div className="max-w-7xl mx-auto">
          {blogPosts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-crimson font-normal mb-2">No blog posts yet</h3>
              <p className="text-neutral-500">Check back soon for latest insights and stories</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => {
                const safePost = { ...post, tags: post.tags || [] }
                return (
                <Link
                  key={post.id}
                  href={`/stories/blog/${post.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-neutral-100">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {safePost.coverImage ? (
                        <>
                          <Image
                            src={safePost.coverImage}
                            alt={safePost.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                          <FileText className="w-16 h-16 text-neutral-300" />
                        </div>
                      )}

                      {/* Overlay badge */}
                      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full">
                        <div className="text-xs font-bold text-neutral-900">BLOG</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-2xl font-crimson font-normal tracking-tighter mb-3 group-hover:text-neutral-700 transition-colors line-clamp-2">
                        {safePost.title}
                      </h2>

                      {safePost.excerpt && (
                        <p className="text-neutral-600 mb-4 line-clamp-3 flex-1">
                          {safePost.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div className="flex items-center gap-3">
                          {safePost.author.image && (
                            <Image
                              src={safePost.author.image}
                              alt={safePost.author.name || "Author"}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <div className="text-sm font-bold text-neutral-900">
                              {safePost.author.name || "Anonymous"}
                            </div>
                            {safePost.publishedAt && (
                              <div className="text-xs text-neutral-500">
                                {new Date(safePost.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-neutral-900 group-hover:translate-x-1 transition-transform">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          )}
        </div>
      </section>
    </div>
  )
}


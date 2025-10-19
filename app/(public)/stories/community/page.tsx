import { getPublishedPosts } from "@/lib/db/queries"
import Link from "next/link"

export default async function CommunityHighlightsPage() {
  const posts = await getPublishedPosts()
  const communityPosts = posts.filter(p => p.category === "stories")

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
      {/* Warm Community Header */}
      <section className="relative z-0 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/stories" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stories
          </Link>
          
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full">
              COMMUNITY HIGHLIGHTS
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 text-white">
            Our
            <br />
            <span className="text-gold">
              People
            </span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl font-light">
            Stories from the heart of our community - celebrating voices, journeys, and connections
          </p>
        </div>
      </section>

      {/* Community Cards - Social Media Feed Style */}
      <section className="relative z-0 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {communityPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💜</div>
              <h3 className="text-2xl font-bold text-white mb-2">No community stories yet</h3>
              <p className="text-white/70">Check back soon for highlights from our community</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {communityPosts.map((post) => {
                const safePost = { ...post, tags: post.tags || [] }
                return (
                <Link
                  key={post.id}
                  href={`/stories/community/${post.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {safePost.coverImage ? (
                        <>
                          <img
                            src={safePost.coverImage}
                            alt={safePost.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <div className="text-6xl">👥</div>
                        </div>
                      )}

                      {/* Overlay badge */}
                      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full">
                        <div className="text-xs font-bold text-purple-600">COMMUNITY</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-2xl font-bold tracking-tight mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
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
                            <img
                              src={safePost.author.image}
                              alt={safePost.author.name || "Author"}
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
                        
                        <div className="text-purple-600 group-hover:translate-x-1 transition-transform">
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


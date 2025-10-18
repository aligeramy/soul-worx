import { getPostBySlug, getPublishedPosts } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import Link from "next/link"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function EventRecapDetailPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post || post.category !== "news" || post.status !== "published") {
    notFound()
  }

  // Get related posts
  const allPosts = await getPublishedPosts()
  const relatedPosts = allPosts
    .filter(p => p.category === "news" && p.id !== post.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/stories/events" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Event Recaps
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-bold rounded-full">
              EVENT RECAP
            </span>
            
            {post.publishedAt && (
              <div className="px-4 py-2 bg-white rounded-full border-2 border-amber-200">
                <div className="text-sm font-bold text-amber-900">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-2xl text-neutral-600 font-light leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-6 pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              {post.author.image && (
                <img
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  className="w-14 h-14 rounded-full"
                />
              )}
              <div>
                <div className="font-bold text-neutral-900 text-lg">
                  {post.author.name || "Anonymous"}
                </div>
                <div className="text-neutral-600 text-sm">
                  Event Organizer
                </div>
              </div>
            </div>
            
            {post.readTime && (
              <div className="flex items-center gap-2 text-neutral-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime} min read
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <article 
            className="prose prose-lg prose-amber max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-neutral-700 prose-p:leading-relaxed
              prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-amber-600
              prose-strong:text-neutral-900
              prose-ul:text-neutral-700
              prose-ol:text-neutral-700
              prose-img:rounded-2xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Event Stats (if available) */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Event Highlights</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-900 mb-2">50+</div>
                <div className="text-sm text-amber-700">Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-900 mb-2">15</div>
                <div className="text-sm text-amber-700">Performances</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-900 mb-2">3hrs</div>
                <div className="text-sm text-amber-700">Duration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Event CTA */}
      <section className="pb-20 px-6 border-t border-neutral-200 pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Don't Miss Our Next Event</h3>
            <p className="text-amber-100 mb-8 text-lg">
              Join us for upcoming workshops, performances, and community gatherings
            </p>
            <Link 
              href="/programs/calendar"
              className="inline-block px-8 py-4 bg-white text-amber-600 rounded-full font-bold hover:bg-amber-50 transition-colors"
            >
              View Event Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-neutral-200 pt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">More Event Recaps</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/stories/events/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full">
                    {relatedPost.coverImage && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      {relatedPost.publishedAt && (
                        <div className="text-xs font-bold text-amber-600 mb-2">
                          {new Date(relatedPost.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      
                      {relatedPost.excerpt && (
                        <p className="text-neutral-600 line-clamp-2 text-sm">
                          {relatedPost.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}


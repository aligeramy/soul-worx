import { getPostBySlug, getPublishedPosts } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import Link from "next/link"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post || post.category !== "stories" || post.status !== "published") {
    notFound()
  }

  // Get related posts
  const allPosts = await getPublishedPosts()
  const relatedPosts = allPosts
    .filter(p => p.category === "stories" && p.id !== post.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/stories/community" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Community
          </Link>
          
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full">
              COMMUNITY HIGHLIGHT
            </span>
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
                  className="w-14 h-14 rounded-full ring-4 ring-purple-100"
                />
              )}
              <div>
                <div className="font-bold text-neutral-900 text-lg">
                  {post.author.name || "Anonymous"}
                </div>
                <div className="text-neutral-600">
                  {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            
            {post.readTime && (
              <div className="text-neutral-600">
                {post.readTime} min read
              </div>
            )}
            
            <div className="flex items-center gap-2 text-neutral-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.viewCount}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <article 
            className="prose prose-lg prose-purple max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-neutral-700 prose-p:leading-relaxed
              prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-purple-600
              prose-strong:text-neutral-900
              prose-ul:text-neutral-700
              prose-ol:text-neutral-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Share Section */}
      <section className="pb-20 px-6 border-t border-neutral-200 pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Share This Story</h3>
            <p className="text-neutral-600 mb-6">Help us celebrate this voice from our community</p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-purple-600 hover:text-white transition-colors">
                Share on Twitter
              </button>
              <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-purple-600 hover:text-white transition-colors">
                Share on Facebook
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-neutral-200 pt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">More Community Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/stories/community/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full">
                    {relatedPost.coverImage && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
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


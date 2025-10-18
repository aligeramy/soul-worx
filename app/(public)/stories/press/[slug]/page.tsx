import { getPostBySlug, getPublishedPosts } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import Link from "next/link"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function PressDetailPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post || post.category !== "announcements" || post.status !== "published") {
    notFound()
  }

  // Get related posts
  const allPosts = await getPublishedPosts()
  const relatedPosts = allPosts
    .filter(p => p.category === "announcements" && p.id !== post.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Hero Section - Professional News Style */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/stories/press" 
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Press & Media
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-bold rounded-full">
              PRESS RELEASE
            </span>
          </div>
          
          {post.publishedAt && (
            <div className="text-sm font-bold text-green-600 mb-6">
              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-neutral-700 leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between pb-8 border-b-2 border-neutral-200">
            <div className="flex items-center gap-3">
              {post.author.image && (
                <img
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <div className="font-bold text-neutral-900">
                  {post.author.name || "Soulworx Team"}
                </div>
                <div className="text-sm text-neutral-600">
                  Media Contact
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {post.readTime && (
                <div className="text-sm text-neutral-600">
                  {post.readTime} min read
                </div>
              )}
              
              <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              
              <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section className="pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-neutral-200">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content - Professional Article Style */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <article 
            className="prose prose-lg prose-green max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-900
              prose-p:text-neutral-700 prose-p:leading-relaxed
              prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-green-600 prose-blockquote:bg-green-50 prose-blockquote:p-4
              prose-strong:text-neutral-900 prose-strong:font-bold
              prose-ul:text-neutral-700
              prose-ol:text-neutral-700
              prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Media Contact Section */}
      <section className="pb-20 px-6 border-t border-neutral-200 pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border border-green-100">
            <h3 className="text-xl font-bold mb-4 text-neutral-900">Media Contact</h3>
            <div className="space-y-2 text-neutral-700">
              <p><strong>Organization:</strong> Soulworx</p>
              <p><strong>Email:</strong> press@soulworx.com</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Website:</strong> www.soulworx.com</p>
            </div>
            <div className="mt-6 pt-6 border-t border-green-200">
              <Link 
                href="/contact/press"
                className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700"
              >
                Request Press Kit
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Press Releases */}
      {relatedPosts.length > 0 && (
        <section className="pb-32 px-6 border-t border-neutral-200 pt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Related Press Releases</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/stories/press/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all h-full border border-neutral-100">
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
                        <div className="text-xs font-bold text-green-600 mb-2">
                          {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric'
                          })}
                        </div>
                      )}
                      
                      <h3 className="text-lg font-bold mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
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


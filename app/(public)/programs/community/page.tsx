import { Suspense } from "react"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { communityChannels, membershipTiers, userMemberships } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SubscribeButton } from "@/components/community/subscribe-button"

async function getUserMembership(userId: string | undefined) {
  if (!userId) return null
  
  return await db.query.userMemberships.findFirst({
    where: and(
      eq(userMemberships.userId, userId),
      eq(userMemberships.status, "active")
    ),
    with: {
      tier: true,
    },
  })
}

async function getChannels() {
  return await db.query.communityChannels.findMany({
    where: eq(communityChannels.status, "published"),
    orderBy: (channels, { desc }) => [desc(channels.sortOrder)],
  })
}

async function getTiers() {
  return await db.query.membershipTiers.findMany({
    where: eq(membershipTiers.isActive, true),
    orderBy: (tiers, { asc }) => [asc(tiers.sortOrder)],
  })
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; session_id?: string }>
}) {
  const session = await auth()
  const params = await searchParams
  
  // If coming from successful checkout, process it immediately
  if (params.success === 'true' && params.session_id && session?.user?.id) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/community/checkout-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: params.session_id }),
      })
    } catch (error) {
      console.error('Error processing checkout:', error)
    }
  }
  
  const [membership, channels, tiers] = await Promise.all([
    getUserMembership(session?.user?.id),
    getChannels(),
    getTiers(),
  ])

  const userTierLevel = membership?.tier?.accessLevel || 1 // Default to tier 1 (free)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Success Message */}
      {params.success === 'true' && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-900 font-semibold">Payment successful! 🎉</p>
                <p className="text-green-700 text-sm">Your membership is now active. Enjoy your content!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Community
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Access exclusive video content, tutorials, and resources to help you excel
              in basketball, career development, and more.
            </p>
            {!membership && (
              <div className="flex gap-4 justify-center">
                <a href="#membership-tiers">
                  <Button size="lg" variant="default">
                    View Membership Tiers
                  </Button>
                </a>
              </div>
            )}
            {membership && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-sm font-medium">Your Membership</p>
                <p className="text-2xl font-bold">{membership.tier.name}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Channels Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Community Channels</h2>
        
        <Suspense fallback={<div>Loading channels...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => {
              const hasFullAccess = userTierLevel >= channel.requiredTierLevel
              const canViewChannel = true // Everyone can view channel pages to see first episodes
              const isLocked = !hasFullAccess

              return (
                <Card key={channel.id} className="overflow-hidden">
                  {channel.coverImage && (
                    <div className="relative h-48">
                      <img
                        src={channel.coverImage}
                        alt={channel.title}
                        className="w-full h-full object-cover"
                      />
                      {isLocked && (
                        <div className="absolute top-2 right-2">
                          <span className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-full font-medium shadow-lg">
                            Tier {channel.requiredTierLevel}+ for All
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{channel.title}</h3>
                    </div>
                    
                    <p className="text-neutral-600 mb-4">{channel.description}</p>
                    
                    <div className="text-sm text-neutral-500 mb-4">
                      {channel.videoCount} videos
                      {!hasFullAccess && (
                        <span className="ml-2 text-green-600 font-medium">
                          • 1st episode FREE
                        </span>
                      )}
                    </div>

                    <Link href={`/programs/community/${channel.slug}`}>
                      <Button className="w-full" variant={hasFullAccess ? "default" : "outline"}>
                        {hasFullAccess ? "Watch All Videos" : "Watch Free Episode"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        </Suspense>
      </section>

      {/* Membership Tiers Section */}
      <section id="membership-tiers" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Membership Tiers</h2>
            <p className="text-xl text-neutral-600">
              Choose the plan that works for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => {
              const isCurrent = membership?.tier?.id === tier.id
              const price = parseFloat(tier.price?.toString() || "0")

              return (
                <Card
                  key={tier.id}
                  className={`p-8 ${
                    tier.level === "premium"
                      ? "border-2 border-purple-600 shadow-lg"
                      : ""
                  }`}
                >
                  {tier.level === "premium" && (
                    <div className="text-center mb-4">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="text-4xl font-bold mb-2">
                      {price === 0 ? "Free" : `$${price.toFixed(0)}`}
                      {price > 0 && (
                        <span className="text-lg font-normal text-neutral-600">
                          /{tier.billingPeriod === "yearly" ? "year" : "month"}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {!session?.user ? (
                    <Link href="/signin">
                      <Button className="w-full">
                        {price === 0 ? "Sign In to Access" : "Sign In to Subscribe"}
                      </Button>
                    </Link>
                  ) : (
                    <SubscribeButton
                      tierId={tier.id}
                      tierName={tier.name}
                      isCurrentPlan={isCurrent}
                      isFree={price === 0}
                      hasExistingMembership={!!membership}
                    />
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}


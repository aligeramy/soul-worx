import { Suspense } from "react"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { communityChannels, membershipTiers, userMemberships } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChannelCard } from "@/components/community/channel-card"
import { CommunityPricing } from "@/components/community/community-pricing"

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
                <p className="text-green-900 font-semibold">Payment successful!</p>
                <p className="text-green-700 text-sm">Your membership is now active. Enjoy your content!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/optimized/0K0A3966 (2).jpg"
          alt="Join Our Community"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Online Programs
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mb-8">
              Access exclusive online programs, tutorials, and resources to help you excel
              in basketball, career development, and more.
            </p>
            {!membership && (
              <div className="flex gap-4">
                <a href="#membership-tiers">
                  <Button size="lg" variant="default" className="bg-white text-neutral-900 hover:bg-white/90">
                    View Membership Tiers
                  </Button>
                </a>
              </div>
            )}
            {membership && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-sm font-medium text-white/80">Your Membership</p>
                <p className="text-2xl font-crimson font-normal text-white">{membership.tier.name}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Channels Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-8">Available Channels</h2>
        
        <Suspense fallback={<div>Loading programs...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                id={channel.id}
                slug={channel.slug}
                title={channel.title}
                description={channel.description}
                coverImage={channel.coverImage}
                videoCount={channel.videoCount}
                requiredTierLevel={channel.requiredTierLevel}
                userTierLevel={userTierLevel}
              />
            ))}
          </div>
        </Suspense>
      </section>

      {/* Membership Tiers Section */}
      <section id="membership-tiers" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-crimson font-normal tracking-tighter mb-4">Membership Tiers</h2>
            <p className="text-xl text-neutral-600">
              Choose the plan that works for you
            </p>
          </div>

          <CommunityPricing
            tiers={tiers}
            currentTierId={membership?.tier?.id}
            isAuthenticated={!!session?.user}
          />
        </div>
      </section>
    </div>
  )
}


import Image from "next/image"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { TestimonialsStats } from "@/components/testimonials-stats"
import { AwardsRibbon } from "@/components/awards-ribbon"
import { ProgramsSection } from "@/components/programs-section"
import { GallerySlideshow } from "@/components/gallery-slideshow"
import { getPrograms, getUpcomingEvents } from "@/lib/db/queries"

export default async function Home() {
  const programs = await getPrograms()
  const upcomingEvents = await getUpcomingEvents()
  
  // Map programs with their upcoming events
  const programsWithEvents = programs.map(program => {
    const upcomingEvent = upcomingEvents.find(event => event.programId === program.id)
    return upcomingEvent ? { ...program, upcomingEvent } : program
  })
  
  // Filter programs that have upcoming events
  const upcomingPrograms = programsWithEvents.filter(p => 'upcomingEvent' in p && p.upcomingEvent)

  return (
    <div className="bg-brand-bg-darker min-h-screen">
      <HeroSection />

      {/* Awards Ribbon between hero and programs */}
      <AwardsRibbon />

      {/* Programs Section with Parallax */}
      <ProgramsSection 
        programs={programs} 
        upcomingPrograms={upcomingPrograms}
      />

      {/* Combined Testimonials + Stats */}
      <TestimonialsStats />

      {/* Featured Program Section */}
      <section className="bg-neutral-50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src="/optimized/0K0A3921.jpg"
                alt="Featured Program"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-black/5 rounded-full">
                <span className="text-sm font-semibold uppercase tracking-wider">Featured Program</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-crimson font-normal tracking-tight">
                Youth Poetry Workshop
              </h2>
              <p className="text-xl text-neutral-600 font-light leading-relaxed">
                Join us for an immersive experience where young voices discover the power of their words. 
                Through guided sessions and creative exercises, participants learn to express themselves 
                authentically and connect with their community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/programs">
                  <button className="px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-black/90 transition-all duration-300 hover:scale-105">
                    Register Now
                  </button>
                </Link>
                <Link href="/programs">
                  <button className="px-8 py-4 bg-white border-2 border-black/10 text-black font-semibold rounded-full hover:bg-black/5 transition-all duration-300">
                    View All Programs
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section 
        className="relative text-white py-32 px-6"
        style={{
          backgroundColor: 'rgb(25, 21, 18)',
        }}
      >
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url('/noise.png')`,
            backgroundRepeat: 'repeat',
            opacity: 0.3,
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-8">
            {/* SoulWorx Logo */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 border border-white text-white 
               rounded-2xl flex flex-col items-center justify-center space-y-1">
                <Image
                  src="/logo/svg/logo.svg"
                  alt="SoulWorx Logo"
                  width={48}
                  height={48}
                  className="w-10 h-10 invert"
                />
                <p className="text-white text-[9px] font-geist font-bold tracking-tight uppercase">Community</p>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-crimson font-normal tracking-tight leading-tight">
             Join the Community
            </h2>
            <p className="text-xl font-crimson text-white/80 max-w-2xl mx-auto">
              Connect with poets, creators, and changemakers. Get exclusive access to workshops, 
              video content, and live sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {/* Free Tier */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-2xl font-crimson text-white">Free</h3>
                  <div className="text-xs text-white/60 uppercase tracking-wide">Membership</div>
                  <div className="text-3xl font-crimson font-normal text-white">$0</div>
                </div>
                <div className="space-y-4">
                  <div className="text-white/80 text-sm py-2 border-b border-white/10">Program announcements</div>
                  <div className="text-white/80 text-sm py-2 border-b border-white/10">Community access</div>
                  <div className="text-white/80 text-sm py-2">Weekly newsletter</div>
                </div>
              </div>
            </div>

            {/* Paid Tier */}
            <div className="bg-white text-black rounded-3xl p-8 transform scale-105 shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="px-4 py-1 bg-brand-bg-darker border border-white text-white text-xs font-geist font-bold rounded-full">
                  POPULAR
                </div>
              </div>
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-2xl font-crimson">Soulmate</h3>
                  <div className="text-xs text-neutral-500 uppercase tracking-wide">Membership</div>
                  <div className="text-3xl font-crimson font-normal">$9<span className="text-lg font-normal">/mo</span></div>
                </div>
                <div className="space-y-4">
                  <div className="text-neutral-700 text-sm py-2 border-b border-neutral-200">Video library access</div>
                  <div className="text-neutral-700 text-sm py-2 border-b border-neutral-200">Exclusive channels</div>
                  <div className="text-neutral-700 text-sm py-2">Digital workshops</div>
                </div>
              </div>
            </div>

            {/* Premium Tier */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-2xl font-crimson text-white">Elite</h3>
                  <div className="text-xs text-white/60 uppercase tracking-wide">Membership</div>
                  <div className="text-3xl font-crimson font-normal text-white">$29<span className="text-lg font-normal">/mo</span></div>
                </div>
                <div className="space-y-4">
                  <div className="text-white/80 text-sm py-2 border-b border-white/10">Live sessions</div>
                  <div className="text-white/80 text-sm py-2 border-b border-white/10">Early merch access</div>
                  <div className="text-white/80 text-sm py-2">1-on-1 Q&A</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Link href="/community">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#E8E9FF] text-[#5865F2] rounded-lg hover:bg-[#D1D3FF] transition-all duration-300 hover:scale-105 shadow-lg group">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.105 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <span className="font-semibold text-[#5865F2]">Add to Discord</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-brand-bg-darker px-6 relative">
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `url('/noise.png')`,
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl md:text-6xl font-crimson font-normal tracking-tight text-white">
              Moments That Matter
            </h2>
            <p className="text-xl text-white/80 font-light max-w-2xl mx-auto">
              Capturing the energy, emotion, and transformation that happens when words come alive
            </p>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Poetry Card */}
            <Link href="/poetry">
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-6">
                  <Image
                    src="/quick-nav/poetry.jpg"
                    alt="Poetry"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-4xl font-crimson text-white mb-2">Poetry</h3>
                    <p className="text-white/90 text-lg font-light">Where words become art</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Programs Card */}
            <Link href="/programs">
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-6">
                  <Image
                    src="/quick-nav/programs.jpg"
                    alt="Programs"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-4xl font-crimson text-white mb-2">Programs</h3>
                    <p className="text-white/90 text-lg font-light">Transform through expression</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Shop Card */}
            <Link href="/shop">
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                  <Image
                    src="/quick-nav/shop.jpg"
                    alt="Shop"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-4xl font-crimson text-white mb-2">Shop</h3>
                    <p className="text-white/90 text-lg font-light">Wear the movement</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 - Slideshow with Event Recaps */}
            <GallerySlideshow
              images={[
                "/home-gallery/1.jpg",
                "/home-gallery/2.jpg", 
                "/home-gallery/3.jpg",
                "/home-gallery/4.jpg"
              ]}
              title="Event Recaps"
              description="Capturing the energy of our community"
            />

            {/* Column 2 - 4 Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                "/home-gallery/5.jpg",
                "/home-gallery/6.jpg",
                "/home-gallery/7.jpg",
                "/home-gallery/8.jpg",
              ].map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
                  <Image
                    src={src}
                    alt={`Gallery image ${i + 5}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

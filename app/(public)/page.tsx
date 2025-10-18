"use client"

import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
              Words that Walk Through Souls
            </h1>

            {/* Subheading */}
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 drop-shadow-xl">
              Unveil the Poetry of Life with Soulworx
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center">
              <Link href="/signin">
                <button className="px-10 py-4 bg-white text-black font-semibold text-lg rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-2xl">
                  Join the Movement
                </button>
              </Link>
              <Link href="/shop">
                <button className="px-10 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                  Shop Soulworx
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 !border-white rounded-full flex items-start justify-center p-2">
            <div className="w-0.5 h-3 bg-white/70 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Three Cards Section */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poetry Card */}
            <Link href="/poetry">
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-6">
                  <Image
                    src="/optimized/0K0A4950.jpg"
                    alt="Poetry"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-4xl font-bold text-white mb-2">Poetry</h3>
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
                    src="/optimized/0K0A5119.jpg"
                    alt="Programs"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-4xl font-bold text-white mb-2">Programs</h3>
                    <p className="text-white/90 text-lg font-light">Transform through expression</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Shop Card */}
            <Link href="/shop">
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-6">
                  <Image
                    src="/optimized/0K0A2885.jpg"
                    alt="Shop"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-4xl font-bold text-white mb-2">Shop</h3>
                    <p className="text-white/90 text-lg font-light">Wear the movement</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-xl text-white/70 font-light">Youth Served</div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-xl text-white/70 font-light">Workshops</div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-xl text-white/70 font-light">Cities</div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                100+
              </div>
              <div className="text-xl text-white/70 font-light">Schools</div>
            </div>
          </div>
        </div>
      </section>

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
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
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
      <section className="bg-gradient-to-b from-indigo-600 to-purple-700 text-white py-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Join Our Community
            </h2>
            <p className="text-2xl font-light text-white/90 max-w-3xl mx-auto">
              Connect with poets, creators, and changemakers. Get exclusive access to workshops, 
              video content, and live sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {/* Free Tier */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="space-y-4 text-left">
                <h3 className="text-2xl font-bold">Free</h3>
                <div className="text-4xl font-bold">$0</div>
                <ul className="space-y-3 text-white/90">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Program announcements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Community access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Weekly newsletter</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Paid Tier */}
            <div className="bg-white text-black rounded-3xl p-8 transform scale-105 shadow-2xl">
              <div className="space-y-4 text-left">
                <div className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold">Creator</h3>
                <div className="text-4xl font-bold">$9<span className="text-lg font-normal">/mo</span></div>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Video library access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Exclusive channels</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Digital workshops</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Tier */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="space-y-4 text-left">
                <h3 className="text-2xl font-bold">VIP</h3>
                <div className="text-4xl font-bold">$29<span className="text-lg font-normal">/mo</span></div>
                <ul className="space-y-3 text-white/90">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Live sessions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Early merch access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>1-on-1 Q&A</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Link href="/community">
              <button className="px-10 py-4 bg-white text-purple-700 font-bold text-lg rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl">
                Join Discord Community
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Moments That Matter
            </h2>
            <p className="text-xl text-neutral-600 font-light max-w-2xl mx-auto">
              Capturing the energy, emotion, and transformation that happens when words come alive
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "/optimized/0K0A4102.jpg",
              "/optimized/0K0A5232.jpg",
              "/optimized/0K0A2967.jpg",
              "/optimized/0K0A4172.jpg",
              "/optimized/0K0A1830.jpg",
              "/optimized/0K0A5207.jpg",
              "/optimized/0K0A2999.jpg",
              "/optimized/0K0A3003.jpg",
            ].map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
                <Image
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(12px);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

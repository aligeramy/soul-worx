"use client"

import Image from "next/image"
import Link from "next/link"

export function ExploreSection() {
  return (
    <section 
      className="relative text-white pt-4 pb-4 px-6"
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
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  src="/optimized/0K0A5119.jpg"
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
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-6">
                <Image
                  src="/optimized/0K0A2885.jpg"
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
      </div>
    </section>
  )
}


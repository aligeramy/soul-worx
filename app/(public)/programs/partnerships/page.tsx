import Image from "next/image"

const sponsorLogos = [
  "/sponsor-logos/AXIS.webp",
  "/sponsor-logos/CIBC_logo.png",
  "/sponsor-logos/Crane Logo.webp",
  "/sponsor-logos/Duma.webp",
  "/sponsor-logos/Gummy_Gainz_RGB_Horizontal_Logo_Peach.webp",
  "/sponsor-logos/Indigo_logo.png",
  "/sponsor-logos/KOA.png",
  "/sponsor-logos/Pur and simple.webp",
  "/sponsor-logos/Reframe-Wellbeing-logo.webp",
  "/sponsor-logos/Stellas.png",
  "/sponsor-logos/Vaughan Library.png",
  "/sponsor-logos/YAY_logo.png",
  "/sponsor-logos/ycdsb-logo.png",
]

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <Image
          src="/optimized/0K0A3921.jpg"
          alt="Partnerships"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-white/80 mb-2 text-sm font-bold uppercase tracking-wider">
              PARTNERSHIPS
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Our Partners
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Together with our partners, we create opportunities for youth to find their voice 
              and express themselves through poetry and creative writing.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="relative py-24 px-6 bg-white">
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url('/noise.png')`,
            backgroundRepeat: 'repeat',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-crimson font-normal tracking-tight mb-4">
              Trusted Collaborators
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We&apos;re grateful to work with organizations and institutions that share our mission 
              of empowering youth through creative expression.
            </p>
          </div>

          {/* Grid of logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
            {sponsorLogos.map((logo, index) => (
              <div
                key={index}
                className="group relative aspect-[16/9] flex items-center justify-center p-6 bg-neutral-50 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="relative w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src={logo}
                    alt={`Partner ${index + 1}`}
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-24 text-center bg-neutral-50 rounded-3xl p-12 border border-neutral-200">
            <h3 className="text-2xl md:text-3xl font-crimson font-normal tracking-tight mb-4">
              Interested in Partnering?
            </h3>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for new collaborations that help us reach more youth and 
              create more opportunities for creative expression.
            </p>
            <a
              href="/contact/sponsors"
              className="inline-block px-8 py-4 bg-brand-bg-darker text-white rounded-lg font-semibold hover:bg-brand-bg-darker/90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}


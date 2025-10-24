"use client"

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

export function SponsorSlider() {
  return (
    <section className="relative bg-brand-bg-darker py-16 px-6 overflow-hidden">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url('/noise.png')`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-crimson font-normal text-white tracking-tight">
            Our Partners
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Gradient fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-bg-darker to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-bg-darker to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling Content */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-medium">
              {/* First set of logos */}
              {sponsorLogos.map((logo, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 mx-6"
                >
                  <div className="relative w-24 h-16 md:w-32 md:h-20 opacity-70 grayscale">
                    <Image
                      src={logo}
                      alt={`Sponsor ${index + 1}`}
                      fill
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {sponsorLogos.map((logo, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 mx-6"
                >
                  <div className="relative w-24 h-16 md:w-32 md:h-20 opacity-70 grayscale">
                    <Image
                      src={logo}
                      alt={`Sponsor ${index + 1}`}
                      fill
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


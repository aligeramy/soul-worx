import { CategoryCard } from "@/components/ui/category-card"

export default function ContactPage() {
  const categories = [
    {
      title: "General Inquiry",
      description: "Get in touch with our team",
      href: "/contact/general",
      image: "/optimized/0K0A5081.jpg"
    },
    {
      title: "Sponsors & Partnerships",
      description: "Collaborate and support our mission",
      href: "/contact/sponsors",
      image: "/optimized/0K0A5725.jpg"
    },
    {
      title: "Youth Program Registration",
      description: "Enroll in our youth workshops",
      href: "/contact/programs",
      image: "/optimized/AA5A1560 copy.jpg"

    },
    {
      title: "Press & Media",
      description: "Media inquiries and press kit",
      href: "/contact/press",
      image: "/optimized/0K0A4164 (1).jpg"

    }
  ]

  return (
    <div className="min-h-screen bg-brand-bg-darker relative">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url('/noise.png')`,
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Modern Header */}
      <section className="relative z-0 pt-48 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full">
              CONTACT
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 text-white">
            Let&apos;s
            <br />
            <span className="text-gold">
              Connect
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl font-light">
            We&apos;re here to answer questions, collaborate, and build community together
          </p>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="relative z-0 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.href}
                {...category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


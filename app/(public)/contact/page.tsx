import { CategoryCard } from "@/components/ui/category-card"

export default function ContactPage() {
  const categories = [
    {
      title: "General Inquiry",
      description: "Get in touch with our team",
      href: "/contact/general",
      image: "/optimized/0K0A5672.jpg"
    },
    {
      title: "Sponsors & Partnerships",
      description: "Collaborate and support our mission",
      href: "/contact/sponsors",
      image: "/optimized/AA5A2314 copy.jpg"
    },
    {
      title: "Youth Program Registration",
      description: "Enroll in our youth workshops",
      href: "/contact/programs",
      image: "/optimized/0K0A4164 (1).jpg"
    },
    {
      title: "Press & Media",
      description: "Media inquiries and press kit",
      href: "/contact/press",
      image: "/optimized/AA5A1560 copy.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Modern Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-black text-white text-sm font-bold rounded-full">
              CONTACT
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            Let&apos;s
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Connect
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl font-light">
            We&apos;re here to answer questions, collaborate, and build community together
          </p>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="pb-32 px-6">
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


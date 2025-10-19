import { CategoryCard } from "@/components/ui/category-card"
import Image from "next/image"

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/optimized/contact.jpg"
          alt="Contact"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-white/80 mb-2 text-sm font-bold uppercase tracking-wider">
              CONTACT
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Let&apos;s Connect
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              We&apos;re here to answer questions, collaborate, and build community together
            </p>
          </div>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="relative z-0 pb-32 px-6 pt-16 bg-white">
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


import Image from "next/image"
import Link from "next/link"

export default function InspiresPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[480px] overflow-hidden">
        <Image
          src="/optimized/0K0A1830.jpg"
          alt="Soulworx Inspires"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 pb-12">
            <div className="max-w-6xl mx-auto text-white">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Soulworx Inspires
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-crimson font-normal tracking-tight">
                A Non-Profit Movement for Opportunity
              </h1>
              <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-3xl font-crimson">
                Soulworx Inspires is our non-profit initiative focused on building pathways for youth and families.
                Resources are used for charitable purposes only: &quot;poverty relief&quot; and &quot;advancement of education&quot;.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact/sponsors"
                  className="px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition"
                >
                  Partner With Us
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 border border-white/60 text-white font-semibold rounded-md hover:bg-white/10 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-crimson font-normal tracking-tight text-neutral-900">
              Every resource fuels impact where it matters most
            </h2>
            <p className="text-lg text-neutral-700 leading-relaxed">
              We activate local partners, educators, mentors, and volunteers to remove barriers to learning and
              stability. Soulworx Inspires exists to expand access, lift communities, and support youth with
              programs rooted in dignity, creativity, and growth.
            </p>
            <p className="text-lg text-neutral-700 leading-relaxed">
              As a non-profit initiative, we prioritize transparency and purpose-driven stewardship so that our
              community knows exactly how resources are used and why.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/optimized/0K0A2892.jpg"
              alt="Community workshop"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-20 px-6 bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Impact Areas
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-crimson font-normal tracking-tight">
              Focused, measurable, and community-led
            </h2>
            <p className="mt-4 text-lg text-white/80">
              We concentrate resources where they can be felt immediately and where long-term opportunity is built.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Poverty Relief",
                description:
                  "Direct support for essential needs that stabilize families and create space for learning and growth."
              },
              {
                title: "Advancement of Education",
                description:
                  "Programs, workshops, and mentorship that expand access to learning, literacy, and creative development."
              }
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
              >
                <h3 className="text-2xl font-crimson font-normal mb-3">{item.title}</h3>
                <p className="text-white/80 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
            <Image
              src="/optimized/0K0A0925.jpg"
              alt="Mentorship and learning"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-crimson font-normal tracking-tight text-neutral-900">
              Built with partners, guided by community
            </h2>
            <p className="text-lg text-neutral-700 leading-relaxed">
              Soulworx Inspires collaborates with schools, non-profit partners, and local leaders to deliver programming that
              meets real needs. We invest in people, places, and programs with clear outcomes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Youth mentorship and coaching",
                "School-based workshops and literacy",
                "Community learning supplies",
                "Emergency support collaborations"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-neutral-900" />
                  <span className="text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6 bg-neutral-100 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/optimized/0K0A0798.jpg"
            alt="Community impact"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative max-w-6xl mx-auto rounded-3xl bg-white/95 backdrop-blur-sm shadow-xl border border-neutral-200 p-10 md:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Get Involved
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl font-crimson font-normal tracking-tight text-neutral-900">
                Help expand access and opportunity
              </h2>
              <p className="mt-4 text-lg text-neutral-700 leading-relaxed">
                Whether you want to sponsor a program, volunteer, or host a workshop, we&apos;ll help you find the right
                way to support Soulworx Inspires.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact/sponsors"
                className="px-6 py-4 bg-neutral-900 text-white rounded-md font-semibold text-center hover:bg-neutral-800 transition"
              >
                Sponsor a Program
              </Link>
              <Link
                href="/contact"
                className="px-6 py-4 border border-neutral-300 text-neutral-900 rounded-md font-semibold text-center hover:bg-neutral-50 transition"
              >
                Volunteer or Connect
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

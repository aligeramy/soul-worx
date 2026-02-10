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
                Poverty Relief Initiatives
              </h1>
              <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-3xl font-crimson">
                We provide relief of poverty by removing financial barriers that prevent children and youth from
                accessing essential developmental opportunities.
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

      {/* Intro */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Poverty Relief Initiatives
            </div>
            <h2 className="text-4xl md:text-5xl font-crimson font-normal tracking-tight text-neutral-900">
              Removing financial barriers for children and youth
            </h2>
            <p className="text-lg text-neutral-700 leading-relaxed">
              Our organization provides relief of poverty by removing financial barriers that prevent children and
              youth from accessing essential developmental opportunities. We focus on supporting individuals and
              families who are experiencing economic hardship, with the goal of improving long-term outcomes,
              well-being, and self-sufficiency.
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

      {/* Initiatives */}
      <section className="py-20 px-6 bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Our Initiatives
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-crimson font-normal tracking-tight">
              How we deliver poverty relief
            </h2>
          </div>

          <div className="space-y-10">
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <h3 className="text-2xl font-crimson font-normal mb-3">
                1. Sponsorship for Youth Participation in Sport
              </h3>
              <p className="text-white/80 leading-relaxed mb-4">
                We provide financial support to children and youth from low-income households to access organized
                sports programs. This includes covering costs such as registration fees, equipment, uniforms, and
                related participation expenses.
              </p>
              <p className="text-white/80 leading-relaxed">
                By sponsoring access to sport, we help reduce the financial burden on families living in poverty
                while supporting physical health, social development, confidence, and positive community engagement.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <h3 className="text-2xl font-crimson font-normal mb-3">
                2. Sponsorship for Youth Participation in Creative Arts
              </h3>
              <p className="text-white/80 leading-relaxed mb-4">
                We provide financial assistance to children and youth from economically disadvantaged backgrounds to
                participate in creative arts programming, including but not limited to writing, visual arts, music,
                and performance-based activities.
              </p>
              <p className="text-white/80 leading-relaxed">
                These sponsorships help remove financial barriers to creative expression and skill development,
                supporting mental well-being, emotional expression, and personal growth for youth who may otherwise
                lack access to such opportunities due to poverty.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <h3 className="text-2xl font-crimson font-normal mb-3">
                3. Pre-Funded Financial Support for Youth (Ages 12+)
              </h3>
              <p className="text-white/80 leading-relaxed mb-4">
                For youth aged 12 and older from low-income or financially vulnerable households, we provide
                pre-funded, purpose-restricted financial support to assist with basic and developmental needs. These
                funds may be used for approved expenses such as education-related costs, transportation, employment
                readiness, or essential living supports.
              </p>
              <p className="text-white/80 leading-relaxed">
                All financial assistance is provided with clear guidelines and oversight to ensure funds are used in
                alignment with our charitable purpose of relieving poverty and supporting youth toward stability,
                independence, and long-term success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accountability */}
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
              Our Commitment to Accountability
            </div>
            <h2 className="text-4xl md:text-5xl font-crimson font-normal tracking-tight text-neutral-900">
              Delivered in accordance with Canadian charity law
            </h2>
            <p className="text-lg text-neutral-700 leading-relaxed">
              All poverty relief initiatives are delivered in accordance with Canadian charity law. Beneficiaries are
              selected based on demonstrated financial need, and all support is provided directly to individuals or
              through approved third-party programs to ensure funds are used exclusively for charitable purposes.
            </p>
          </div>
        </div>
      </section>

      {/* Founder signature */}
      <section className="py-16 px-6 bg-neutral-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg font-semibold text-neutral-900">Indiana Rotondo</p>
          <p className="text-neutral-600">Founder | SoulWorx</p>
          <p className="text-sm text-neutral-500 mt-1">SoulWorx</p>
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

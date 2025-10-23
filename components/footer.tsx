import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer 
      className="relative text-white bg-brand-bg-darker"
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
      {/* Newsletter Section */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-crimson tracking-tight">
                Stay Connected
              </h3>
              <p className="text-xl text-white/70 font-light max-w-xl">
                Join our community and get the latest updates on workshops, events, and poetry drops.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm transition-all"
              />
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="inline-block">
                <div className="relative w-16 h-16 mb-4">
                  <Image
                    src="/logo/app-icon.png"
                    alt="Soulworx"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
              <h4 className="text-2xl font-bold">Soulworx</h4>
              <p className="text-white/70 font-light leading-relaxed max-w-sm">
                Words that walk through souls. Empowering youth through the transformative power of poetry and creative expression.
              </p>
              <div className="flex gap-4 pt-4">
                <a
                  href="https://instagram.com/soulworx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/soulworx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com/soulworx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://discord.gg/soulworx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="Discord"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Programs Column */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold uppercase tracking-wider text-white/50">Programs</h5>
              <ul className="space-y-3">
                <li>
                  <Link href="/programs" className="text-white/70 hover:text-white transition-colors font-light">
                    All Programs
                  </Link>
                </li>
                <li>
                  <Link href="/programs/calendar" className="text-white/70 hover:text-white transition-colors font-light">
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/programs/community" className="text-white/70 hover:text-white transition-colors font-light">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/programs/youth" className="text-white/70 hover:text-white transition-colors font-light">
                    Youth Workshops
                  </Link>
                </li>
                <li>
                  <Link href="/programs/partnerships" className="text-white/70 hover:text-white transition-colors font-light">
                    Partnerships
                  </Link>
                </li>
              </ul>
            </div>

            {/* Shop & Stories Column */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold uppercase tracking-wider text-white/50">Explore</h5>
              <ul className="space-y-3">
                <li>
                  <Link href="/shop" className="text-white/70 hover:text-white transition-colors font-light">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/stories" className="text-white/70 hover:text-white transition-colors font-light">
                    Stories
                  </Link>
                </li>
                <li>
                  <Link href="/stories/poetry" className="text-white/70 hover:text-white transition-colors font-light">
                    Poetry Drops
                  </Link>
                </li>
                <li>
                  <Link href="/stories/events" className="text-white/70 hover:text-white transition-colors font-light">
                    Event Recaps
                  </Link>
                </li>
                <li>
                  <Link href="/stories/press" className="text-white/70 hover:text-white transition-colors font-light">
                    Press & Media
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold uppercase tracking-wider text-white/50">Get In Touch</h5>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white transition-colors font-light">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact/sponsors" className="text-white/70 hover:text-white transition-colors font-light">
                    Sponsorships
                  </Link>
                </li>
                <li>
                  <Link href="/contact/programs" className="text-white/70 hover:text-white transition-colors font-light">
                    Program Inquiries
                  </Link>
                </li>
                <li>
                  <Link href="/contact/press" className="text-white/70 hover:text-white transition-colors font-light">
                    Press & Media
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors font-light">
                    Member Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-white/50">
              <span className="font-light">© 2025 Soulworx. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-white transition-colors font-light">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors font-light">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors font-light">
                Cookie Policy
              </Link>
            </div>
            <div className="text-sm text-white/50 font-light">
              Made with <span className="text-red-500">♥</span> for the culture
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}


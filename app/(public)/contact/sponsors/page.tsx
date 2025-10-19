"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Building2, DollarSign, Heart, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SponsorsPage() {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    sponsorshipLevel: "",
    interests: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        organizationName: "",
        contactName: "",
        email: "",
        phone: "",
        website: "",
        sponsorshipLevel: "",
        interests: "",
        message: "",
      })
    }, 3000)
  }

  const sponsorshipTiers = [
    {
      name: "Community Partner",
      amount: "$1,000 - $4,999",
      icon: Heart,
      benefits: [
        "Logo on website",
        "Social media recognition",
        "Newsletter mention"
      ]
    },
    {
      name: "Program Sponsor",
      amount: "$5,000 - $9,999",
      icon: Building2,
      benefits: [
        "All Community Partner benefits",
        "Event signage",
        "Program materials acknowledgment",
        "Quarterly impact reports"
      ]
    },
    {
      name: "Premier Partner",
      amount: "$10,000+",
      icon: Sparkles,
      benefits: [
        "All Program Sponsor benefits",
        "Featured sponsor status",
        "Speaking opportunity at event",
        "Custom partnership package"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <Image
          src="/optimized/0K0A5725.jpg"
          alt="Sponsorship"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold uppercase tracking-wider">Back to Contact</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-crimson font-normal tracking-tight text-white mb-3">
              Sponsors & Partnerships
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Partner with us to transform lives through the power of spoken word and creative expression.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-crimson font-normal mb-4">
              Partnership Opportunities
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Choose a partnership level that aligns with your values and makes a meaningful impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sponsorshipTiers.map((tier) => {
              const Icon = tier.icon
              return (
                <div 
                  key={tier.name}
                  className="bg-white rounded-2xl p-8 border-2 border-neutral-200 hover:border-brand-bg-darker transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-brand-bg-darker/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-brand-bg-darker" />
                  </div>
                  <h3 className="text-xl font-crimson font-normal mb-2">{tier.name}</h3>
                  <p className="text-2xl font-semibold text-brand-bg-darker mb-6">{tier.amount}</p>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-brand-bg-darker mt-0.5 shrink-0" />
                        <span className="text-neutral-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-crimson font-normal mb-4">
              Let&apos;s Start a Conversation
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Fill out the form below and our team will reach out to discuss partnership opportunities.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-crimson font-normal mb-2">Thank You!</h3>
              <p className="text-neutral-600">
                We&apos;re excited about the possibility of partnering with you. Our team will be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  placeholder="Your Company or Organization"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person *</Label>
                  <Input
                    id="contactName"
                    placeholder="Full Name"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsorshipLevel">Interested Partnership Level *</Label>
                <Select 
                  required
                  value={formData.sponsorshipLevel}
                  onValueChange={(value) => setFormData({ ...formData, sponsorshipLevel: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a partnership level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community">Community Partner ($1,000 - $4,999)</SelectItem>
                    <SelectItem value="program">Program Sponsor ($5,000 - $9,999)</SelectItem>
                    <SelectItem value="premier">Premier Partner ($10,000+)</SelectItem>
                    <SelectItem value="custom">Custom Partnership</SelectItem>
                    <SelectItem value="exploring">Just Exploring Options</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Areas of Interest</Label>
                <Select 
                  value={formData.interests}
                  onValueChange={(value) => setFormData({ ...formData, interests: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="What programs interest you most?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youth">Youth Programs</SelectItem>
                    <SelectItem value="workshops">Poetry Workshops</SelectItem>
                    <SelectItem value="events">Community Events</SelectItem>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="custom">Custom Initiative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Tell Us About Your Goals *</Label>
                <Textarea
                  id="message"
                  placeholder="Share what you hope to achieve through this partnership..."
                  rows={6}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-brand-bg-darker hover:bg-brand-bg-darker/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Partnership Inquiry
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-6 bg-brand-bg-darker text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-crimson font-normal mb-4">
              Your Impact
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              When you partner with SoulWorx, you&apos;re investing in the future of our community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-white/80">Youth Served Annually</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-white/80">Programs & Events</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-white/80">Transparent Impact</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


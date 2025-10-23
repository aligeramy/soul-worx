"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Newspaper, Camera, Download, Send, FileText } from "lucide-react"
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

export default function PressPage() {
  const [formData, setFormData] = useState({
    name: "",
    outlet: "",
    email: "",
    phone: "",
    mediaType: "",
    subject: "",
    deadline: "",
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
        name: "",
        outlet: "",
        email: "",
        phone: "",
        mediaType: "",
        subject: "",
        deadline: "",
        message: "",
      })
    }, 3000)
  }

  const pressResources = [
    {
      title: "Press Kit",
      description: "Logos, photos, and brand assets",
      icon: FileText,
      action: "Download Kit"
    },
    {
      title: "Media Photos",
      description: "High-resolution event photos",
      icon: Camera,
      action: "View Gallery"
    },
    {
      title: "Recent Coverage",
      description: "Latest media mentions and articles",
      icon: Newspaper,
      action: "View Coverage"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <Image
          src="/optimized/0K0A4164 (1).jpg"
          alt="Press & Media"
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
              Press & Media
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Resources and information for journalists, bloggers, and media professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Press Resources */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-crimson font-normal mb-4">
              Media Resources
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Download our press kit, access high-quality images, and view recent media coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pressResources.map((resource) => {
              const Icon = resource.icon
              return (
                <div 
                  key={resource.title}
                  className="bg-white rounded-2xl p-8 border-2 border-neutral-200 hover:border-brand-bg-darker transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-brand-bg-darker/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-brand-bg-darker" />
                  </div>
                  <h3 className="text-xl font-crimson font-normal mb-2">{resource.title}</h3>
                  <p className="text-sm text-neutral-600 mb-6">{resource.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {resource.action}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-brand-bg-darker text-white rounded-3xl p-12">
            <h2 className="text-3xl font-crimson font-normal mb-8 text-center">
              Quick Facts About SoulWorx
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">Founded</div>
                <div className="text-white/80">2018</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-white/80">Youth Impacted</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-white/80">Events Annually</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">LA Based</div>
                <div className="text-white/80">Los Angeles, CA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Inquiry Form */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-crimson font-normal mb-4">
              Media Inquiry Form
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Have a story idea or need more information? We&apos;re here to help with your coverage.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-crimson font-normal mb-2">Inquiry Received!</h3>
              <p className="text-neutral-600">
                Thank you for your interest. Our media team will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outlet">Media Outlet *</Label>
                  <Input
                    id="outlet"
                    placeholder="Publication or Organization"
                    required
                    value={formData.outlet}
                    onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="journalist@outlet.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaType">Media Type *</Label>
                <Select 
                  required
                  value={formData.mediaType}
                  onValueChange={(value) => setFormData({ ...formData, mediaType: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="print">Print/Online Publication</SelectItem>
                    <SelectItem value="tv">Television</SelectItem>
                    <SelectItem value="radio">Radio/Podcast</SelectItem>
                    <SelectItem value="blog">Blog/Independent Media</SelectItem>
                    <SelectItem value="social">Social Media/Influencer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Story Focus *</Label>
                <Select 
                  required
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="What's the focus of your story?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profile">Profile/Feature Story</SelectItem>
                    <SelectItem value="event">Event Coverage</SelectItem>
                    <SelectItem value="interview">Interview Request</SelectItem>
                    <SelectItem value="youth-programs">Youth Programs</SelectItem>
                    <SelectItem value="community-impact">Community Impact</SelectItem>
                    <SelectItem value="general">General Information</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Publication Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
                <p className="text-xs text-neutral-500">
                  Let us know if you&apos;re working on a tight deadline
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Inquiry Details *</Label>
                <Textarea
                  id="message"
                  placeholder="Please provide details about your story angle, questions, or what information you need..."
                  rows={6}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <p className="text-sm text-neutral-600">
                  <strong>Note for Media:</strong> We aim to respond to all media inquiries within 24 hours. 
                  For urgent requests or breaking news, please indicate this in your message.
                </p>
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
                    Submit Media Inquiry
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-neutral-500">
                General press contact: <a href="mailto:press@soulworx.com" className="text-brand-bg-darker hover:underline">press@soulworx.com</a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Featured Coverage (Optional) */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-crimson font-normal mb-8">
              As Featured In
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
              <div className="text-2xl font-bold">LA TIMES</div>
              <div className="text-2xl font-bold">NPR</div>
              <div className="text-2xl font-bold">VARIETY</div>
              <div className="text-2xl font-bold">LOCAL NEWS</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


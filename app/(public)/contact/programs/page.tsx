"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Users, Calendar, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProgramsPage() {
  const [formData, setFormData] = useState({
    participantName: "",
    dateOfBirth: "",
    parentName: "",
    email: "",
    phone: "",
    address: "",
    program: "",
    heardAbout: "",
    experience: "",
    goals: "",
    medicalInfo: "",
    emergencyContact: "",
    emergencyPhone: "",
    consent: false,
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
        participantName: "",
        dateOfBirth: "",
        parentName: "",
        email: "",
        phone: "",
        address: "",
        program: "",
        heardAbout: "",
        experience: "",
        goals: "",
        medicalInfo: "",
        emergencyContact: "",
        emergencyPhone: "",
        consent: false,
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <Image
          src="/optimized/AA5A1560 copy.jpg"
          alt="Youth Programs"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold uppercase tracking-wider">Back to Contact</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-crimson font-normal tracking-tight text-white mb-3">
              Youth Program Registration
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Join our transformative programs designed to empower youth through creative expression.
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-brand-bg-darker/10 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-brand-bg-darker" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Age Range</h3>
                <p className="text-sm text-neutral-600">
                  Programs available for youth ages 12-18. Some programs may have specific age requirements.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-brand-bg-darker/10 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-brand-bg-darker" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Program Duration</h3>
                <p className="text-sm text-neutral-600">
                  Most programs run 6-8 weeks. Workshop schedules vary by program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-crimson font-normal mb-4">
              Registration Form
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Complete the form below to register for one of our youth programs. We&apos;ll contact you with next steps.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-crimson font-normal mb-2">Registration Received!</h3>
              <p className="text-neutral-600 mb-4">
                Thank you for registering. We&apos;ll contact you within 2-3 business days with program details.
              </p>
              <p className="text-sm text-neutral-500">
                Check your email for a confirmation message.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Participant Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Participant Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="participantName">Participant Full Name *</Label>
                    <Input
                      id="participantName"
                      placeholder="Full Name"
                      required
                      value={formData.participantName}
                      onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Parent/Guardian Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                  <Input
                    id="parentName"
                    placeholder="Full Name"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="parent@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Street Address, City, State ZIP"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              {/* Program Selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Program Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="program">Select Program *</Label>
                  <Select 
                    required
                    value={formData.program}
                    onValueChange={(value) => setFormData({ ...formData, program: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spoken-word">Spoken Word Workshop</SelectItem>
                      <SelectItem value="poetry-writing">Poetry Writing</SelectItem>
                      <SelectItem value="performance">Performance Arts</SelectItem>
                      <SelectItem value="creative-expression">Creative Expression</SelectItem>
                      <SelectItem value="summer-intensive">Summer Intensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heardAbout">How did you hear about us?</Label>
                  <Select 
                    value={formData.heardAbout}
                    onValueChange={(value) => setFormData({ ...formData, heardAbout: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="school">School/Teacher</SelectItem>
                      <SelectItem value="friend">Friend/Family</SelectItem>
                      <SelectItem value="event">Attended an Event</SelectItem>
                      <SelectItem value="web-search">Web Search</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Previous Experience with Poetry/Spoken Word</Label>
                  <Textarea
                    id="experience"
                    placeholder="Tell us about any previous experience (or none!)"
                    rows={3}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">What are your goals for this program?</Label>
                  <Textarea
                    id="goals"
                    placeholder="What do you hope to learn or achieve?"
                    rows={3}
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  />
                </div>
              </div>

              {/* Medical & Emergency */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Medical & Emergency Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalInfo">
                    Medical Information (allergies, conditions, medications)
                  </Label>
                  <Textarea
                    id="medicalInfo"
                    placeholder="Please list any relevant medical information we should know"
                    rows={3}
                    value={formData.medicalInfo}
                    onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Full Name"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      required
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg">
                <Checkbox
                  id="consent"
                  required
                  checked={formData.consent}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, consent: checked as boolean })
                  }
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="consent"
                    className="text-sm font-normal cursor-pointer"
                  >
                    I consent to my child&apos;s participation in the selected program *
                  </Label>
                  <p className="text-xs text-neutral-600">
                    By checking this box, you acknowledge that you have read and agree to the program terms 
                    and grant permission for your child to participate.
                  </p>
                </div>
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
                    Submitting Registration...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Registration
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-neutral-500">
                Questions? Email us at <a href="mailto:programs@soulworx.com" className="text-brand-bg-darker hover:underline">programs@soulworx.com</a>
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}


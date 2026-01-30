"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Sparkles, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UpgradePromptProps {
  feature: string
}

export function UpgradePrompt({ feature }: UpgradePromptProps) {
  const router = useRouter()

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-2">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-neutral-100">
              <Lock className="h-12 w-12 text-neutral-400" />
            </div>
          </div>
          <CardTitle className="text-3xl">Upgrade to Access {feature}</CardTitle>
          <CardDescription className="text-lg">
            {feature} is available for Pro and Pro+ members. Upgrade now to unlock this feature and more!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pro Tier */}
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <CardTitle>Pro</CardTitle>
                </div>
                <div className="text-2xl font-bold">$20<span className="text-sm font-normal text-neutral-600">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Access to all videos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Soulworx AI Assistant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>1-2 programs per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>VIP Discord access</span>
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => router.push("/upgrade?tier=pro")}
                >
                  Upgrade to Pro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Pro+ Tier */}
            <Card className="border-2 border-purple-300 hover:border-purple-400 transition-colors relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <CardTitle>Pro+</CardTitle>
                </div>
                <div className="text-2xl font-bold">$25<span className="text-sm font-normal text-neutral-600">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Personalized programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Video upload & review</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Private Discord channel</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  onClick={() => router.push("/upgrade?tier=pro_plus")}
                >
                  Upgrade to Pro+
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link href="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900">
              ← Back to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

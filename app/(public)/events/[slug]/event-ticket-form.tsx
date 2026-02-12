"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PRESETS = [15, 25, 50, 75, 100]

export function EventTicketForm({
  eventId,
  minPriceCents,
}: {
  eventId: string
  eventSlug: string
  eventTitle: string
  minPriceCents: number
}) {
  const minDollars = minPriceCents / 100
  const [amount, setAmount] = useState(minDollars)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discountedCents: number
    label: string
  } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const amountCents = Math.round(amount * 100)
  const displayCents = appliedCoupon ? appliedCoupon.discountedCents : amountCents
  const displayDollars = displayCents / 100
  const isFree = displayCents === 0
  const isValid =
    (isFree || displayCents >= minPriceCents) &&
    email.trim().length > 0 &&
    (isFree || amount >= minDollars)

  const validateCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setAppliedCoupon(null)
      setCouponError(null)
      return
    }
    setCouponError(null)
    try {
      const res = await fetch(
        `/api/events/validate-coupon?eventId=${encodeURIComponent(eventId)}&code=${encodeURIComponent(couponCode.trim())}&amountCents=${amountCents}`
      )
      const data = await res.json()
      if (data.valid) {
        setAppliedCoupon({
          code: couponCode.trim(),
          discountedCents: data.discountedCents,
          label: data.label,
        })
      } else {
        setAppliedCoupon(null)
        setCouponError(data.error || "Invalid coupon")
      }
    } catch {
      setAppliedCoupon(null)
      setCouponError("Could not validate coupon")
    }
  }, [eventId, couponCode, amountCents])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/events/ticket-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          amountCents,
          email: email.trim(),
          name: name.trim() || undefined,
          couponCode: appliedCoupon ? couponCode.trim() : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Checkout failed")
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="email" className="text-white/80 text-sm">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10 md:h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm md:text-base"
        />
      </div>
      <div className="space-y-1.5 md:space-y-2">
        <Label htmlFor="name" className="text-white/80 text-sm">
          Name (for ticket)
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 md:h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm md:text-base"
        />
      </div>
      <div className="space-y-2 md:space-y-3">
        <Label className="text-white/80 text-sm">Amount (CAD)</Label>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {PRESETS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setAmount(d)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                amount === d
                  ? "bg-white text-[rgb(25,21,18)]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              ${d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">$</span>
          <Input
            type="number"
            min={minDollars}
            step={1}
            value={amount}
            onChange={(e) => {
              setAmount(parseFloat(e.target.value) || minDollars)
              if (appliedCoupon) setAppliedCoupon(null)
            }}
            className="h-10 w-20 md:w-24 bg-white/10 border-white/20 text-white text-sm md:text-base"
          />
        </div>
        <p className="text-white/50 text-xs">minimum ${minDollars}</p>
      </div>

      <div className="space-y-1.5 md:space-y-2">
        <Label className="text-white/80 text-sm">Coupon code</Label>
        <div className="flex gap-1.5 md:gap-2">
          <Input
            type="text"
            placeholder="e.g. POETRY10"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase())
              setAppliedCoupon(null)
              setCouponError(null)
            }}
            className="h-10 md:h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={validateCoupon}
            className="h-10 md:h-11 shrink-0 px-4 md:px-5 text-sm font-medium border-2 border-white/40 text-white bg-transparent hover:bg-white/15 hover:border-white/70 transition-colors"
          >
            Apply
          </Button>
        </div>
        {appliedCoupon && (
          <p className="text-xs md:text-sm text-emerald-400">
            {appliedCoupon.label} applied. You pay: ${(appliedCoupon.discountedCents / 100).toFixed(2)}
            {isFree && " — Free ticket!"}
          </p>
        )}
        {couponError && <p className="text-xs md:text-sm text-red-400">{couponError}</p>}
      </div>

      {error && <p className="text-xs md:text-sm text-red-400">{error}</p>}
      <Button
        type="submit"
        disabled={!isValid || loading}
        className="w-full h-11 md:h-12 bg-white text-[rgb(25,21,18)] hover:bg-white/90 font-semibold text-sm md:text-base"
      >
        {loading
          ? "Redirecting…"
          : isFree
            ? "Get free ticket"
            : `Pay $${displayDollars.toFixed(0)} — Get ticket`}
      </Button>
    </form>
  )
}

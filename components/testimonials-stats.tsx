"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface Testimonial {
	id: string
	quote: string
	author: string
	location?: string
}

interface TestimonialsStatsProps {
	className?: string
	stats?: {
		label: string
		value: string
	}[]
	title?: string
	lede?: string
	testimonials?: Testimonial[]
	intervalMs?: number
}

const ROTATING_TITLES = [
	"Testimonials",
	"What They Say",
	"Real Stories",
	"Their Voices",
	"Their Impact",
]

export function TestimonialsStats({
	className,
	stats = [
		{ label: "Youth Served", value: "10K+" },
		{ label: "Workshops", value: "500+" },
		{ label: "Cities", value: "50+" },
		{ label: "Schools", value: "100+" },
	],
	testimonials = [
		{
			id: "01",
			quote:
				"Before Soulworx, I was terrified to speak. Now I perform at open mics and share my story with confidence. This program changed my life.",
			author: "Maya Rodriguez",
			location: "Regent Park Community Centre",
		},
		{
			id: "02",
			quote:
				"After 15 years of teaching, I've never seen anything like the transformation Soulworx brought to my classroom. It's not just poetry—it's healing.",
			author: "Dr. Sarah Chen",
			location: "Central Technical School",
		},
		{
			id: "03",
			quote:
				"My son found his voice through Soulworx. From anxiety to mentor—this program changed everything.",
			author: "Marcus Thompson",
			location: "Jane & Finch Community Centre",
		},
		{
			id: "04",
			quote:
				"Soulworx became my family when I had none. Through poetry, I found my voice and now I'm in college studying social work to help others.",
			author: "Jasmine Williams",
			location: "Scarborough Youth Centre",
		},
	],
	intervalMs = 5000,
}: TestimonialsStatsProps) {
	const [active, setActive] = useState(0)
	const [titleIndex, setTitleIndex] = useState(0)
	const [displayedTitle, setDisplayedTitle] = useState("")
	const [isFadingOut, setIsFadingOut] = useState(false)
	const sectionRef = useRef<HTMLElement>(null)

	// Filter out the static testimonial (Marcus Thompson) from slideshow
	const slideshowTestimonials = testimonials.filter((_, index) => index !== 2) // Remove index 2 (Marcus Thompson)
	const total = slideshowTestimonials.length
	useEffect(() => {
		const id = setInterval(() => setActive((i) => (i + 1) % total), Math.max(2500, intervalMs))
		return () => clearInterval(id)
	}, [intervalMs, total])


	// Rotating title animation
	useEffect(() => {
		const currentTitle = ROTATING_TITLES[titleIndex]
		let charIndex = 0
		let fadeOutTimer: NodeJS.Timeout
		let nextTitleTimer: NodeJS.Timeout

		// Fade in letter by letter
		const fadeInInterval = setInterval(() => {
			if (charIndex <= currentTitle.length) {
				setDisplayedTitle(currentTitle.slice(0, charIndex))
				charIndex++
			} else {
				clearInterval(fadeInInterval)
				// Hold for 2 seconds, then fade out
				fadeOutTimer = setTimeout(() => {
					setIsFadingOut(true)
					nextTitleTimer = setTimeout(() => {
						setIsFadingOut(false)
						setTitleIndex((prev) => (prev + 1) % ROTATING_TITLES.length)
					}, 800) // fade out duration
				}, 2000)
			}
		}, 80) // speed of letter reveal

		return () => {
			clearInterval(fadeInInterval)
			clearTimeout(fadeOutTimer)
			clearTimeout(nextTitleTimer)
		}
	}, [titleIndex])

	const activeTestimonial = useMemo(() => slideshowTestimonials[active], [active, slideshowTestimonials])

	return (
		<section 
			ref={sectionRef}
			className={cn("relative text-white overflow-hidden", className)}
			style={{
				backgroundColor: 'rgb(25, 21, 18)',
			}}
		>
			{/* Top gradient fade from programs section */}
			<div 
				className="absolute top-0 inset-x-0 h-32 z-10 pointer-events-none"
				style={{
					background: 'linear-gradient(to bottom, rgb(25, 21, 18) 0%, transparent 100%)',
				}}
			/>

			{/* Noise texture overlay */}
			<div 
				className="absolute inset-0 pointer-events-none"
				style={{
					backgroundImage: `url('/noise.png')`,
					backgroundRepeat: 'repeat',
					opacity: 0.3,
				}}
			/>


			<div className="relative max-w-7xl mx-auto px-6 py-24">
				{/* Framed container to emulate the reference */}
				<div 
					className="relative rounded-[28px] border border-white/10 overflow-hidden min-h-[600px]"
					style={{
						backgroundColor: 'rgb(25, 21, 18)',
					}}
				>
					{/* Inner vignette */}
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]" />

					{/* Huge centered title - ANIMATED */}
					<h2
						aria-hidden
						className={cn(
							"absolute inset-0 flex items-center justify-center text-center text-[12vw] leading-none font-crimson font-light tracking-tight text-white/10 select-none pointer-events-none transition-opacity duration-700",
							isFadingOut ? "opacity-0" : "opacity-100"
						)}
					>
						{displayedTitle}
					</h2>

					{/* Top-right review (slides) - smaller */}
					<figure className="absolute top-12 right-10 w-[min(420px,38%)] rounded-2xl border border-white/15 bg-brand-bg-darker/30 backdrop-blur-sm p-6 shadow-2xl">
						<div className="flex items-center justify-end mb-3">
							{/* Pager dots inside card */}
							<div className="flex gap-2">
								{slideshowTestimonials.map((_, i) => (
									<button
										key={i}
										onClick={() => setActive(i)}
										className={cn(
											"h-1.5 rounded-full transition-all",
											i === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
										)}
										aria-label={`Go to testimonial ${i + 1}`}
									/>
								))}
							</div>
						</div>
						<div key={active} className="animate-fade-in-up">
							<p className="text-white/90 font-crimson text-sm md:text-base leading-relaxed">
								{activeTestimonial.quote}
							</p>
							<figcaption className="mt-3 text-right">
								<div className="flex items-center justify-end gap-2">
									<span className="text-xs font-crimson text-white/70">— {activeTestimonial.author}</span>
									{activeTestimonial.location && (
										<span className="px-2 py-1 text-xs font-crimson text-white/60 border border-white/20 rounded-full">
											{activeTestimonial.location}
										</span>
									)}
								</div>
							</figcaption>
						</div>
					</figure>

					{/* Bottom-left review (static second) - BIGGER and more heartfelt */}
					{testimonials[1] && (
						<figure className="absolute left-10 bottom-20 w-[min(580px,52%)] rounded-2xl border border-white/15 bg-brand-bg-darker/30 backdrop-blur-sm p-6 shadow-2xl">
							<p className="text-white/90 font-crimson text-2xl leading-relaxed">
								{testimonials[1].quote}
							</p>
							<figcaption className="mt-4 text-right">
								<div className="flex items-center justify-end gap-2">
									<span className="text-sm font-crimson text-white/75">— {testimonials[1].author}</span>
									{testimonials[1].location && (
										<span className="px-3 py-1 text-sm font-crimson text-white/60 border border-white/20 rounded-full">
											{testimonials[1].location}
										</span>
									)}
								</div>
							</figcaption>
						</figure>
					)}

					{/* Bottom right stats row (2 items) - moved to far right */}
					<div className="absolute bottom-10 right-12 grid grid-cols-2 gap-12 text-center">
						{(stats.length ? stats.slice(0, 2) : [
							{ value: '1200+', label: 'Reviews' },
							{ value: '10,000+', label: 'Happy Clients' },
						]).map((s, i) => (
							<div key={i}>
								<div className="text-8xl lg:text-7xl font-crimson tracking-tighter bg-gradient-to-r from-white/70 via-white/50 to-white/20 bg-clip-text text-transparent">
									{s.value}
								</div>
								<div className="text-white/70 font-monteci text-2xl tracking-tight">
									{s.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

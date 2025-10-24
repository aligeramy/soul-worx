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
		{ label: "Partnerships", value: "100+" },
	],
	testimonials = [
		{
			id: "01",
			quote:
				"Gorgeous sensory details in the poems, like 'craters of the heart' and 'Path,' rich in experiential detail and brave change in format. Nice variation of sentence structure to give the poems a sense of movement. Again, 'I would know you in different lives' achieves a rare honor in my own judging: praising it twice. It's quite beautiful.",
			author: "Judge",
			location: "32nd Annual Writer's Digest Self-Published Book Awards",
		},
		{
			id: "02",
			quote:
				"Loss is a universal pain, although sometimes loss is a goal. Author walks the circles of this topic very mindfully. We find ourselves as if dropped into a photo the moment the shutter clicks, and all we can do it look around, feeling the emotions of it. 'Me N Mine' was captivating: 'I would know you in different lives.' We all feel like a great love transports you to another time, and love outdoes the laws of science. Each poem gives us a new experience, and we feel the different bumps and sharp edges of loss. Author has traversed the experiences well.",
			author: "Judge",
			location: "32nd Annual Writer's Digest Self-Published Book Awards",
		},
		{
			id: "03",
			quote:
				"This book is exemplary in its structure, organization, and pacing. The structure of the chapters/parts aid in a compelling organization of the story or information. The pacing is even throughout and matches the tone/genre of the book.",
			author: "Judge",
			location: "32nd Annual Writer's Digest Self-Published Book Awards",
		},
		{
			id: "04",
			quote:
				"I'm entranced by the cover image, the glowing green, sundown teal and the use of gold in the lettering. This looks like an upscale comic book with characters who belong there, but we get the essence of character in the author's writing.",
			author: "Judge",
			location: "32nd Annual Writer's Digest Self-Published Book Awards",
		},
	],
	intervalMs = 5000,
}: TestimonialsStatsProps) {
	const [active, setActive] = useState(0)
	const [titleIndex, setTitleIndex] = useState(0)
	const [displayedTitle, setDisplayedTitle] = useState("")
	const [isFadingOut, setIsFadingOut] = useState(false)
	const sectionRef = useRef<HTMLElement>(null)

	// Filter out the static testimonial from slideshow
	const slideshowTestimonials = testimonials.filter((_, index) => index !== 2) // Remove index 2 to avoid duplication
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
			className={cn("relative text-white overflow-hidden bg-brand-bg-darker", className)}
		>
			{/* Top gradient fade from programs section */}
			<div 
				className="absolute top-0 inset-x-0 h-32 z-10 pointer-events-none"
				style={{
					background: 'linear-gradient(to bottom, rgb(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b)) 0%, transparent 100%)',
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
					className="relative rounded-[28px] border border-white/10 overflow-hidden min-h-[600px] bg-brand-bg-darker"
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
							<p className="text-white/90 font-crimson text-xl leading-relaxed">
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

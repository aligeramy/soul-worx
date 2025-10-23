"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const AWARD_SRCS = [
	"/home/awards/1.png",
	"/home/awards/2.png",
	"/home/awards/4.png",
]

export function AwardsRibbon({ className }: { className?: string }) {
	const [isMobile, setIsMobile] = useState(false)
	const [groupIndex, setGroupIndex] = useState(0)
	const [inView, setInView] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	// Detect mobile and update on resize
	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768)
		check()
		window.addEventListener("resize", check)
		return () => window.removeEventListener("resize", check)
	}, [])

	// Auto toggle groups on mobile
	useEffect(() => {
		if (!isMobile) return
		const id = setInterval(() => setGroupIndex((g) => (g === 0 ? 1 : 0)), 3000)
		return () => clearInterval(id)
	}, [isMobile])

	// Observe visibility for desktop cascade
	useEffect(() => {
		if (!ref.current) return
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) setInView(true)
				})
			},
			{ threshold: 0.2 }
		)
		io.observe(ref.current)
		return () => io.disconnect()
	}, [])

	return (
		<section 
			ref={ref} 
			className={cn("relative overflow-hidden bg-brand-bg-darker", className)}
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

			{/* Static Gradient Container - Does not scale with background */}
			<div className="absolute inset-0 z-10 pointer-events-none">
				{/* Additional Top Fade Layer - No Noise - Stronger blend */}
				<div 
					className="absolute top-0 inset-x-0 pointer-events-none" 
					style={{ 
						height: '60%',
						background: 'linear-gradient(to bottom, rgb(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b)) 0%, rgb(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b)) 5%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.95) 10%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.85) 20%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.6) 35%, rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.3) 50%, transparent 100%)',
					}} 
				/>

				{/* Permanent Top Gradient with Noise */}
				<div 
					className="absolute top-0 inset-x-0 pointer-events-none" 
					style={{ 
						height: '60%',
						background: 'linear-gradient(to bottom, rgb(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b)), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.9), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.7), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.5), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.3), rgba(var(--color-brand-bg-darker-r), var(--color-brand-bg-darker-g), var(--color-brand-bg-darker-b), 0.15), transparent)',
					}} 
				>
					{/* Noise texture overlay */}
					<div 
						className="absolute inset-0 opacity-40"
						style={{
							backgroundImage: `url('/noise.png')`,
							backgroundRepeat: 'repeat',
						}}
					/>
				</div>
			</div>

			<div className="relative z-20 max-w-7xl mx-auto px-6 py-1 md:py-2">
				{/* Mobile: two-at-a-time crossfade */}
				<div className="md:hidden relative h-16">
					{/* Group A */}
					<div className={cn(
						"absolute inset-0 flex items-center justify-center gap-0 transition-opacity duration-700",
						groupIndex === 0 ? "opacity-100" : "opacity-0"
					)}>
						{AWARD_SRCS.slice(0, 2).map((src, i) => (
							<div key={src} className="relative h-14 w-48 opacity-90">
								<Image src={src} alt={`Award ${i + 1}`} fill className="object-contain" />
							</div>
						))}
					</div>
					{/* Group B */}
					<div className={cn(
						"absolute inset-0 flex items-center justify-center gap-0 transition-opacity duration-700",
						groupIndex === 1 ? "opacity-100" : "opacity-0"
					)}>
						{AWARD_SRCS.slice(2, 3).map((src, i) => (
							<div key={src} className="relative h-14 w-48 opacity-90">
								<Image src={src} alt={`Award ${i + 3}`} fill className="object-contain" />
							</div>
						))}
					</div>
				</div>

				{/* Desktop: all three with cascade reveal */}
				<div className="hidden md:flex items-center justify-center gap-0">
					{AWARD_SRCS.map((src, i) => (
						<div
							key={src}
							className={cn(
								"relative h-48 w-[28rem] opacity-0 translate-y-2 transition-all duration-700",
								inView ? "opacity-90 translate-y-0" : "",
							)}
							style={{ transitionDelay: `${inView ? i * 120 : 0}ms` }}
						>
							<Image src={src} alt={`Award ${i + 1}`} fill className="object-contain" />
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

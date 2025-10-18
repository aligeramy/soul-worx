"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface Background {
  image: string
  quote: string
  subtext: string
}

interface AuthSlideshowProps {
  backgrounds: Background[]
}

export function AuthSlideshow({ backgrounds }: AuthSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [backgrounds.length])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background Images */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={bg.image}
            alt={bg.quote}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl transition-all duration-1000">
            {backgrounds[currentIndex].quote}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-xl transition-all duration-1000">
            {backgrounds[currentIndex].subtext}
          </p>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


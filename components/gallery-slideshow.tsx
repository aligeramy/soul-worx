"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface GallerySlideshowProps {
  images: string[]
  title: string
  description: string
  className?: string
}

export function GallerySlideshow({ 
  images, 
  title, 
  description, 
  className = "" 
}: GallerySlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length])


  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl group cursor-pointer ${className}`}>
      {/* All images with fade effect */}
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={`${title} - Image ${index + 1}`}
          fill
          className={`absolute object-cover transition-all duration-700 group-hover:scale-110 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-8 left-8 right-8">
        <h3 className="text-4xl font-crimson text-white mb-2">{title}</h3>
        <p className="text-white/90 text-lg font-light">{description}</p>
      </div>


      {/* Navigation arrows */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
          )
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

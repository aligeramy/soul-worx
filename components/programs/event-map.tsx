"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { MapPin } from "lucide-react"

interface EventMapProps {
  latitude: string
  longitude: string
  venueName: string
  venueAddress?: string | null
}

export function EventMap({ latitude, longitude, venueName, venueAddress }: EventMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return // Initialize map only once

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    
    if (!mapboxToken) {
      console.error("Mapbox token not found")
      setError("Map configuration error")
      setIsLoading(false)
      return
    }

    try {
      mapboxgl.accessToken = mapboxToken

      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)

      if (isNaN(lat) || isNaN(lng)) {
        setError("Invalid coordinates")
        setIsLoading(false)
        return
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom: 16,
        pitch: 45, // 3D angle
        bearing: -17.6, // Slight rotation for dynamic view
        attributionControl: false,
      })

      // Handle map load
      map.current.on('load', () => {
        setIsLoading(false)
      })

      // Handle errors
      map.current.on('error', (e) => {
        console.error('Map error:', e)
        setError("Failed to load map")
        setIsLoading(false)
      })

      // Add navigation controls with dark style
      const navControl = new mapboxgl.NavigationControl({
        visualizePitch: true, // Show pitch control for 3D
      })
      map.current.addControl(navControl, "top-right")

      // Add custom marker with bright color for dark theme
      const marker = new mapboxgl.Marker({
        color: "#FF3366", // Bright pink/red for visibility on dark map
        scale: 1.3,
      })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ 
            offset: 25,
            closeButton: false,
            className: 'custom-popup dark-popup'
          }).setHTML(
            `<div style="padding: 12px; font-family: system-ui; background: #1a1a1a; border-radius: 12px;">
              <h3 style="margin: 0 0 6px 0; font-weight: 700; font-size: 16px; color: #fff;">${venueName}</h3>
              ${venueAddress ? `<p style="margin: 0; font-size: 14px; color: #aaa;">${venueAddress}</p>` : ""}
            </div>`
          )
        )
        .addTo(map.current)

      // Show popup on load
      marker.togglePopup()

      // Add subtle rotation animation for 3D effect
      let userInteracted = false
      
      map.current.on('mousedown', () => {
        userInteracted = true
      })

      map.current.on('touchstart', () => {
        userInteracted = true
      })

      // Gentle rotation if user hasn't interacted
      if (!userInteracted) {
        setTimeout(() => {
          if (!userInteracted && map.current) {
            map.current.easeTo({
              bearing: 20,
              duration: 3000,
              easing: (t) => t * (2 - t) // easeOutQuad
            })
          }
        }, 1000)
      }

    } catch (err) {
      console.error('Failed to initialize map:', err)
      setError("Failed to initialize map")
      setIsLoading(false)
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [latitude, longitude, venueName, venueAddress])

  if (error) {
    return (
      <div className="bg-neutral-100 rounded-2xl p-8 border border-neutral-200">
        <div className="flex items-start gap-4">
          <MapPin className="w-6 h-6 text-neutral-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-1">{venueName}</h3>
            {venueAddress && (
              <p className="text-neutral-600 mb-4">{venueAddress}</p>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/90 transition-colors"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="h-[400px] w-full" />
      {!isLoading && !error && (
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-neutral-200">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Get Directions →
          </a>
        </div>
      )}
    </div>
  )
}


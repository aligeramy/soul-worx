"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface CategoryCardProps {
  title: string
  description: string
  href: string
  image: string
  index: number
}

export function CategoryCard({ title, description, href, image, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
    >
      <Link href={href} className="group block">
        <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-[400px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
                {title}
              </h3>
              <p className="text-white/80 text-base leading-relaxed mb-6 max-w-md">
                {description}
              </p>
              
              {/* CTA */}
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm font-semibold tracking-wide">
                  EXPLORE
                </span>
                <motion.div
                  animate={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Corner Accent */}
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          />
        </div>
      </Link>
    </motion.div>
  )
}


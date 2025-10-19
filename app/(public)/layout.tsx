import { Footer } from "@/components/footer"

/**
 * Public Layout
 * 
 * Layout wrapper for public-facing pages (programs, shop, stories, contact, etc.)
 * Navigation is handled by the root NavigationWrapper component
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}


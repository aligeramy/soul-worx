/**
 * Navigation Configuration
 * 
 * Centralized configuration for all navigation menus and links.
 * This file defines the structure, routes, and metadata for the site navigation.
 * 
 * @version 1.0.0
 */

export interface NavigationItem {
  /** Display label for the navigation item */
  label: string
  /** Route path (relative to base URL) */
  href: string
  /** Optional description for accessibility and tooltips */
  description?: string
  /** Child navigation items (submenu) */
  submenu?: NavigationItem[]
}

export interface NavigationConfig {
  /** Left-side navigation items */
  left: NavigationItem[]
  /** Right-side navigation items */
  right: NavigationItem[]
}

/**
 * Routes where navigation should be hidden
 * Note: With route groups (auth), these routes are automatically excluded
 */
export const hideNavigationRoutes = [
  "/signin",
  "/onboarding",
  "/dashboard"
]

/**
 * Check if navigation should be hidden for a given pathname
 */
export function shouldHideNavigation(pathname: string): boolean {
  return hideNavigationRoutes.some(route => pathname.startsWith(route))
}

/**
 * Main navigation configuration
 * Organized with left menu items and right menu items for balanced layout
 */
export const navigationConfig: NavigationConfig = {
  left: [
    {
      label: "Programs",
      href: "/programs",
      submenu: [
        {
          label: "Calendar",
          href: "/programs/calendar",
          description: "View upcoming events and workshops"
        },
        {
          label: "Youth Workshops",
          href: "/programs/youth",
          description: "Creative writing programs for young minds"
        },
        {
          label: "School Partnerships",
          href: "/programs/schools",
          description: "Collaborative programs with educational institutions"
        },
        {
          label: "FAQ",
          href: "/programs/faq",
          description: "Frequently asked questions about our programs"
        }
      ]
    },
    {
      label: "Shop",
      href: "/shop",
      submenu: [
        {
          label: "All Products",
          href: "/shop",
          description: "Browse our complete collection"
        },
        {
          label: "Apparel",
          href: "/shop?category=apparel",
          description: "Clothing and wearable art"
        },
        {
          label: "Accessories",
          href: "/shop?category=accessories",
          description: "Journals, prints, and literary accessories"
        },
        {
          label: "Books",
          href: "/shop?category=books",
          description: "Poetry collections and literary works"
        },
        {
          label: "Digital",
          href: "/shop?category=digital",
          description: "Virtual workshops and online content"
        }
      ]
    }
  ],
  right: [
    {
      label: "Stories",
      href: "/stories",
      submenu: [
        {
          label: "Poetry Drops",
          href: "/stories/poetry",
          description: "Latest poetic expressions and releases"
        },
        {
          label: "Community Highlights",
          href: "/stories/community",
          description: "Stories from our creative community"
        },
        {
          label: "Event Recaps",
          href: "/stories/events",
          description: "Highlights from past workshops and gatherings"
        },
        {
          label: "Press & Media",
          href: "/stories/press",
          description: "Media coverage and press releases"
        }
      ]
    },
    {
      label: "Contact",
      href: "/contact",
      submenu: [
        {
          label: "General Inquiry",
          href: "/contact/general",
          description: "Get in touch with our team"
        },
        {
          label: "Sponsors & Partnerships",
          href: "/contact/sponsors",
          description: "Collaborate and support our mission"
        },
        {
          label: "Youth Program Registration",
          href: "/contact/programs",
          description: "Enroll in our youth workshops"
        },
        {
          label: "Press & Media",
          href: "/contact/press",
          description: "Media inquiries and press kit"
        }
      ]
    }
  ]
}

/**
 * Footer navigation links (optional)
 */
export const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Careers", href: "/careers" }
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" }
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com/soulworx" },
    { label: "Twitter", href: "https://twitter.com/soulworx" },
    { label: "Facebook", href: "https://facebook.com/soulworx" }
  ]
}

/**
 * Utility function to get all navigation items flattened
 */
export function getAllNavigationItems(): NavigationItem[] {
  const items: NavigationItem[] = []
  
  ;[...navigationConfig.left, ...navigationConfig.right].forEach(item => {
    items.push(item)
    if (item.submenu) {
      items.push(...item.submenu)
    }
  })
  
  return items
}

/**
 * Utility function to find a navigation item by href
 */
export function findNavigationItem(href: string): NavigationItem | undefined {
  return getAllNavigationItems().find(item => item.href === href)
}


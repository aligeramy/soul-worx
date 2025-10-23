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
  /** Optional icon name from lucide-react */
  icon?: string
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
          icon: "Calendar"
        },
        {
          label: "Community",
          href: "/programs/community",
          icon: "Users"
        },
        {
          label: "Youth Workshops",
          href: "/programs/youth",
          icon: "Sparkles"
        },
        {
          label: "Partnerships",
          href: "/programs/partnerships",
          icon: "GraduationCap"
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
          icon: "Store"
        },
        {
          label: "Apparel",
          href: "/shop?category=apparel",
          icon: "Shirt"
        },
        {
          label: "Accessories",
          href: "/shop?category=accessories",
          icon: "Gem"
        },
        {
          label: "Books",
          href: "/shop?category=books",
          icon: "BookOpen"
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
          icon: "Feather"
        },
        {
          label: "Blog",
          href: "/stories/blog",
          icon: "FileText"
        },
        {
          label: "Event Recaps",
          href: "/stories/events",
          icon: "Camera"
        },
        {
          label: "Press & Media",
          href: "/stories/press",
          icon: "Newspaper"
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
          icon: "Mail"
        },
        {
          label: "Sponsorships",
          href: "/contact/sponsors",
          icon: "Handshake"
        },
        {
          label: "Youth Program ",
          href: "/contact/programs",
          icon: "ClipboardCheck"
        },
        {
          label: "Press & Media",
          href: "/contact/press",
          icon: "Mic"
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
    { label: "Instagram", href: "https://www.instagram.com/soul.worx/?hl=en" },
    { label: "LinkedIn", href: "https://ca.linkedin.com/in/indiana-rotondo-471b01194" }
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


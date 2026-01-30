import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Apple from "next-auth/providers/apple"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { getUserById } from "@/lib/db/queries"
import { verifyPassword } from "@/lib/auth/password"
import { eq } from "drizzle-orm"
import type { UserRole } from "@/lib/db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
    authenticatorsTable: schema.authenticators,
  }),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user by email
        const user = await db.query.users.findFirst({
          where: eq(schema.users.email, credentials.email as string),
        })

        if (!user || !user.password) {
          return null
        }

        // Verify password
        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        // Return user object (password will be excluded by NextAuth)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Ensure user always has a name (use email prefix if not provided)
      if (!user.name && user.email) {
        user.name = user.email.split("@")[0]
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Handle mobile app redirects
      const urlObj = new URL(url, baseUrl)
      const isMobile = urlObj.searchParams.get("mobile") === "true"
      const scheme = urlObj.searchParams.get("scheme") || "soulworx"
      
      if (isMobile) {
        // For mobile, redirect to a page that will generate token and deep link
        return `${baseUrl}/auth/mobile-callback?scheme=${scheme}`
      }
      
      // Default web redirect
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as UserRole
        // No onboarding needed - users can update their profile anytime
        session.user.needsOnboarding = false
      }
      return session
    },
    async jwt({ token, user }) {
      // On initial sign-in or when user object is provided, update token
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.role = user.role || "user"
        
        // If no name provided (Apple privacy), use email prefix as default
        token.name = user.name || user.email?.split("@")[0] || "User"
      }
      
      return token
    },
    authorized({ auth, request: { nextUrl } }) {
      // IMPORTANT: Don't intercept API routes or they'll return HTML instead of JSON
      const isApiRoute = nextUrl.pathname.startsWith("/api/")
      if (isApiRoute) {
        return true
      }

      const isLoggedIn = !!auth?.user
      const isAdmin = auth?.user?.role === "admin" || auth?.user?.role === "super_admin"
      const isOnboarding = nextUrl.pathname.startsWith("/onboarding")
      const isDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isAdminRoute = nextUrl.pathname.startsWith("/dashboard/admin")
      const isAuth = nextUrl.pathname.startsWith("/signin")

      // Define public routes that should always be accessible
      const isPublicRoute = 
        nextUrl.pathname === "/" ||
        nextUrl.pathname.startsWith("/programs") ||
        nextUrl.pathname.startsWith("/shop") ||
        nextUrl.pathname.startsWith("/stories") ||
        nextUrl.pathname.startsWith("/contact")

      // Always allow access to public routes, even if session is expired/invalid
      if (isPublicRoute) {
        return true
      }

      // Protect admin routes
      if (isAdminRoute && !isAdmin) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      // Redirect to dashboard if already logged in and trying to access auth pages
      if (isLoggedIn && isAuth) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      // Protect dashboard routes (including onboarding)
      if (isDashboard && !isLoggedIn) {
        return Response.redirect(new URL("/signin", nextUrl))
      }

      // Redirect new signups to onboarding
      const isOnboardingRoute = nextUrl.pathname.startsWith("/onboarding")
      if (isLoggedIn && isOnboardingRoute) {
        // Allow access to onboarding routes
        return true
      }

      // Default: allow access (for any other routes)
      return true
    },
  },
})

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
      needsOnboarding?: boolean
    }
  }
  
  interface User {
    role?: UserRole
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: UserRole
  }
}


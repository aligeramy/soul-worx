import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Apple from "next-auth/providers/apple"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { getUserById } from "@/lib/db/queries"
import type { UserRole } from "@/lib/db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
    authenticatorsTable: schema.authenticators,
  }),
  providers: [
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
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as UserRole
        session.user.needsOnboarding = !session.user.name || session.user.name === session.user.email
      }
      return session
    },
    async jwt({ token, user, trigger }) {
      // On initial sign-in, fetch user from database and store role in token
      if (user && user.id) {
        token.sub = user.id
        // Fetch user role only on initial sign-in
        try {
          const dbUser = await getUserById(user.id)
          if (dbUser) {
            token.role = dbUser.role
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
          // Default to 'user' role if query fails
          token.role = "user"
        }
      }
      
      // Only refresh role on explicit update trigger, not on every request
      if (trigger === "update" && token.sub) {
        try {
          const dbUser = await getUserById(token.sub)
          if (dbUser) {
            token.role = dbUser.role
          }
        } catch (error) {
          console.error("Error refreshing user role:", error)
        }
      }
      
      return token
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdmin = auth?.user?.role === "admin" || auth?.user?.role === "super_admin"
      const isOnboarding = nextUrl.pathname.startsWith("/onboarding")
      const isDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isAdminRoute = nextUrl.pathname.startsWith("/dashboard/admin")
      const isAuth = nextUrl.pathname.startsWith("/signin")

      // Protect admin routes
      if (isAdminRoute && !isAdmin) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      // Redirect to onboarding if user needs to complete profile
      if (isLoggedIn && auth.user.needsOnboarding && !isOnboarding) {
        return Response.redirect(new URL("/onboarding", nextUrl))
      }

      // Prevent access to onboarding if already completed
      if (isLoggedIn && !auth.user.needsOnboarding && isOnboarding) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      // Redirect to dashboard if already logged in and trying to access auth pages
      if (isLoggedIn && isAuth) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      // Protect dashboard routes
      if (isDashboard && !isLoggedIn) {
        return Response.redirect(new URL("/signin", nextUrl))
      }

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


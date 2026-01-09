# Architecture Overview

## System Design

This application implements a modern, production-ready authentication system using the latest web technologies.

## Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Public Page    │ (/)
│  Landing Page   │
└────────┬────────┘
         │ Click "Sign In"
         ▼
┌─────────────────┐
│  Auth Page      │ (/signin)
│  Choose OAuth   │
└────────┬────────┘
         │ Select Provider
         ▼
┌─────────────────┐
│  OAuth Provider │ (Google/Discord/Apple)
│  Authorization  │
└────────┬────────┘
         │ Grant Permission
         ▼
┌─────────────────┐
│  Callback       │ (/api/auth/callback/provider)
│  Auth.js        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Middleware     │
│  Check Session  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────┐   ┌─────────┐
│New? │   │Existing?│
└──┬──┘   └────┬────┘
   │           │
   ▼           ▼
┌─────────┐ ┌──────────┐
│Onboard- │ │Dashboard │
│  ing    │ │          │
└────┬────┘ └──────────┘
     │
     │ Complete Profile
     ▼
┌──────────┐
│Dashboard │
└──────────┘
```

## Route Protection Strategy

### Middleware (`middleware.ts`)

The middleware runs on every request and:
1. Checks authentication status
2. Determines if user needs onboarding
3. Redirects based on route rules

### Route Groups

#### `(public)/`
- **Access**: Everyone
- **Routes**: Landing page, marketing pages
- **Redirect**: None

#### `(auth)/`
- **Access**: Unauthenticated users
- **Routes**: Sign in, sign up pages
- **Redirect**: Logged-in users → Dashboard

#### `(dashboard)/`
- **Access**: Authenticated users only
- **Routes**: Dashboard, settings, onboarding
- **Redirect**: Unauthenticated → Sign in

#### Special: `(dashboard)/onboarding`
- **Access**: First-time authenticated users
- **Purpose**: Complete user profile
- **Redirect**: Completed users → Dashboard

## Database Schema

### Users Table
```typescript
{
  id: string (UUID)
  name: string | null
  email: string (unique)
  emailVerified: Date | null
  image: string | null
}
```

### Accounts Table (OAuth)
```typescript
{
  userId: string (FK → users.id)
  type: 'oauth' | 'email' | ...
  provider: 'google' | 'discord' | 'apple'
  providerAccountId: string
  access_token: string
  refresh_token: string
  expires_at: number
  // ... other OAuth fields
}
```

### Sessions Table
```typescript
{
  sessionToken: string (PK)
  userId: string (FK → users.id)
  expires: Date
}
```

## Authentication Strategy

### JWT + Database Hybrid

- **JWT Tokens**: Used for session management (stateless)
- **Database**: Stores user data, accounts, sessions
- **Adapter**: Drizzle adapter syncs JWT with database

### Why This Approach?

✅ **Performance**: JWTs don't require DB lookup on every request  
✅ **Scalability**: Stateless sessions scale horizontally  
✅ **Flexibility**: Database allows complex queries  
✅ **Security**: Can invalidate sessions from database  

## Server Actions

### Profile Update (`app/actions/profile.ts`)

```typescript
updateProfile(formData: FormData) → Promise<void>
```

**Flow:**
1. Validates user session
2. Extracts and validates form data
3. Updates database
4. Revalidates cache
5. Redirects to dashboard

**Security:**
- Server-side only (cannot be called from client)
- Session verification required
- Input validation
- CSRF protection (automatic via Next.js)

## Session Management

### Session Creation
1. User authenticates via OAuth
2. Auth.js creates session in database
3. JWT token generated and sent as cookie
4. Session data stored in token

### Session Verification
1. Every request checks JWT cookie
2. Middleware verifies token signature
3. Session data extracted from token
4. Additional checks via database (onboarding status)

### Session Update
1. Profile changes trigger database update
2. Token updated on next request
3. Session revalidated

## Onboarding Logic

### Detection
```typescript
needsOnboarding = !user.name || user.name === user.email
```

A user needs onboarding if:
- Name is not set, OR
- Name equals email (default from OAuth)

### Flow
1. User signs in via OAuth
2. Auth.js creates user in database
3. Session callback checks onboarding status
4. Middleware redirects to `/onboarding`
5. User completes profile
6. Server action updates database
7. Redirects to dashboard

## Security Features

### 1. CSRF Protection
- Automatic via Next.js Server Actions
- Token-based validation

### 2. OAuth Security
- State parameter for CSRF
- PKCE for authorization code flow
- Secure token storage

### 3. Session Security
- HTTP-only cookies
- Secure flag in production
- SameSite attribute
- Token rotation

### 4. Route Protection
- Middleware-based guards
- Server-side session checks
- Unauthorized redirects

### 5. Input Validation
- Server-side validation required
- Type safety via TypeScript
- Sanitization before DB operations

## Performance Optimizations

### 1. Static Generation
- Public pages are statically generated
- Faster initial page loads
- Better SEO

### 2. Server Components
- Default to server components
- Reduced JavaScript bundle
- Faster page loads

### 3. Database Connection Pooling
- Postgres.js with pooling
- Reuses connections
- Better performance under load

### 4. JWT Sessions
- No database lookup on every request
- Faster authentication checks
- Reduced database load

## Scalability Considerations

### Horizontal Scaling
✅ Stateless sessions (JWT)  
✅ Database connection pooling  
✅ No in-memory session store  

### Database Scaling
- PostgreSQL read replicas supported
- Connection pooler (pgBouncer) ready
- Migrations for schema versioning

### Caching Strategy
- Next.js automatic caching
- `revalidatePath` for selective updates
- Server-side rendering with fresh data

## Error Handling

### Authentication Errors
- OAuth failures → Sign in page with error
- Session expiry → Auto-redirect to sign in
- Invalid credentials → Error message

### Database Errors
- Connection failures → Retry logic
- Constraint violations → User-friendly messages
- Transaction rollbacks → Data consistency

### Form Validation
- Client-side: HTML5 validation
- Server-side: Required validation
- User feedback: Inline error messages

## Future Enhancements

### Recommended
1. **Email verification** - Verify email addresses
2. **Password authentication** - Optional password login
3. **Two-factor authentication** - TOTP/SMS verification
4. **Role-based access control** - User roles and permissions
5. **Session management** - View/revoke active sessions
6. **Account linking** - Link multiple OAuth providers
7. **Audit logging** - Track authentication events

### Advanced
1. **WebAuthn/Passkeys** - Passwordless authentication
2. **Social connections** - More OAuth providers
3. **SSO integration** - SAML/OpenID Connect
4. **Multi-tenancy** - Organization support
5. **API authentication** - JWT for API access

## Tech Stack Justification

### Next.js 15
- Latest features (Server Actions, Turbopack)
- Best-in-class React framework
- Excellent developer experience

### Auth.js (NextAuth v5)
- Industry-standard authentication
- Extensive OAuth provider support
- Active development and community

### Drizzle ORM
- Type-safe database queries
- Excellent TypeScript support
- Performance-focused
- Lightweight compared to Prisma

### PostgreSQL
- Robust and reliable
- Excellent for relational data
- Great performance at scale
- Wide hosting support

### Tailwind CSS + shadcn/ui
- Utility-first styling
- Consistent design system
- Accessible components
- Easy customization

## Monitoring & Debugging

### Development Tools
- Drizzle Studio - Database GUI
- Next.js Dev Tools - React debugging
- Network tab - OAuth flow inspection

### Logs to Monitor
- Authentication attempts
- Session creation/destruction
- Database queries
- API errors

### Health Checks
- Database connectivity
- OAuth provider availability
- Session store accessibility

## Compliance Considerations

### GDPR
- User data export capability needed
- Right to deletion (implement user delete)
- Consent tracking for cookies
- Privacy policy required

### Data Protection
- Encrypted connections (HTTPS)
- Secure password hashing (if adding passwords)
- Token encryption
- Secure environment variables

---

This architecture provides a solid foundation for a production-ready authentication system while remaining simple enough to understand and modify.


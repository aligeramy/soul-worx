"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  
  // Check if this is a mobile app request
  const isMobileApp = searchParams?.get("mobile") === "true"
  const redirectScheme = searchParams?.get("scheme") || "soulworx"

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check username availability (debounced)
  const checkUsername = async (value: string) => {
    if (!value || !value.startsWith("@")) {
      setUsernameAvailable(null)
      return
    }

    // Validate format
    const usernameRegex = /^@[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(value)) {
      setUsernameAvailable(false)
      return
    }

    setCheckingUsername(true)
    try {
      const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(value)}`)
      const data = await response.json()
      setUsernameAvailable(data.available)
    } catch (error) {
      console.error("Error checking username:", error)
      setUsernameAvailable(null)
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    // Debounce username check
    const timeoutId = setTimeout(() => {
      checkUsername(value)
    }, 500)
    return () => clearTimeout(timeoutId)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.name) {
      newErrors.name = "Name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!username) {
      newErrors.username = "Username is required"
    } else if (!/^@[a-zA-Z0-9_]{3,20}$/.test(username)) {
      newErrors.username = "Username must start with @ and be 3-20 alphanumeric characters"
    } else if (usernameAvailable === false) {
      newErrors.username = "This username is already taken"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (usernameAvailable === false) {
      toast.error("Please choose a different username")
      return
    }

    setIsSubmitting(true)

    try {
      // Create account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          username,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account")
      }

      toast.success("Account created successfully!")

      // Automatically sign in the user
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Account created but sign-in failed - redirect to sign in page
        router.push("/signin?registered=true")
        return
      }

      // If mobile app, get token and redirect via deep link
      if (isMobileApp) {
        try {
          const tokenResponse = await fetch("/api/auth/mobile-token", {
            method: "POST",
            credentials: "include",
          })
          
          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json()
            const deepLink = `${redirectScheme}://auth?token=${encodeURIComponent(tokenData.accessToken)}&refreshToken=${encodeURIComponent(tokenData.refreshToken)}`
            window.location.href = deepLink
            return
          }
        } catch (error) {
          console.error("Error getting mobile token:", error)
          // Fall through to normal redirect
        }
      }

      // Redirect to onboarding (web)
      router.push("/onboarding")
      router.refresh()
    } catch (error) {
      console.error("Signup error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" }
    if (password.length < 8) return { strength: 1, label: "Weak", color: "text-red-500" }
    if (password.length < 12) return { strength: 2, label: "Fair", color: "text-yellow-500" }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { strength: 3, label: "Good", color: "text-blue-500" }
    }
    return { strength: 4, label: "Strong", color: "text-green-500" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="w-full space-y-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 text-center mb-6">
        <Image
          src="/logo-v2/w.png"
          alt="Soulworx Logo"
          width={60}
          height={90}
          className="h-15 w-auto border border-black/10 rounded-lg p-3 px-4 scale-70 bg-brand-bg-darker mb-0"
        />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium font-crimson tracking-tight -mt-2">
          Create Your Account
        </h1>
        <p className="text-sm text-neutral-600">
          Join the Soulworx community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <Field label="Email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            required
            disabled={isSubmitting}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </Field>

        {/* Name */}
        <Field label="Full Name" htmlFor="name" required>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
            disabled={isSubmitting}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </Field>

        {/* Username */}
        <Field label="Username" htmlFor="username" required>
          <div className="relative">
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="@username"
              required
              disabled={isSubmitting}
              className={errors.username ? "border-red-500" : ""}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {checkingUsername ? (
                <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
              ) : username && usernameAvailable === true ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : username && usernameAvailable === false ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : null}
            </div>
          </div>
          {errors.username && (
            <p className="text-sm text-red-500 mt-1">{errors.username}</p>
          )}
          {username && usernameAvailable === true && (
            <p className="text-sm text-green-500 mt-1">Username available</p>
          )}
        </Field>

        {/* Password */}
        <Field label="Password" htmlFor="password" required>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 8 characters"
              required
              disabled={isSubmitting}
              className={errors.password ? "border-red-500" : ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
          {formData.password && (
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.strength === 1
                        ? "w-1/4 bg-red-500"
                        : passwordStrength.strength === 2
                        ? "w-1/2 bg-yellow-500"
                        : passwordStrength.strength === 3
                        ? "w-3/4 bg-blue-500"
                        : passwordStrength.strength === 4
                        ? "w-full bg-green-500"
                        : ""
                    }`}
                  />
                </div>
                <span className={`text-xs ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          )}
        </Field>

        {/* Confirm Password */}
        <Field label="Confirm Password" htmlFor="confirmPassword" required>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
              disabled={isSubmitting}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <p className="text-sm text-green-500 mt-1">Passwords match</p>
          )}
        </Field>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || usernameAvailable === false || checkingUsername}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Sign In Link */}
      <div className="text-center text-sm">
        <span className="text-neutral-600">Already have an account? </span>
        <Link href="/signin" className="text-neutral-900 font-medium hover:underline">
          Sign in
        </Link>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-neutral-500">Or continue with</span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
          disabled={isSubmitting}
          className="w-full"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("discord", { callbackUrl: "/onboarding/interest" })}
          disabled={isSubmitting}
          className="w-full"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("apple", { callbackUrl: "/onboarding" })}
          disabled={isSubmitting}
          className="w-full"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

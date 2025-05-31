"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import crypto from "crypto"

// Simple in-memory user store (in a real app, use a database)

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  passwordHash: string
}

// In a real app, this would be a database
const users: Record<string, User> = {}

// Session management
type Session = {
  id: string
  userId: string
  expiresAt: number
}

const sessions: Record<string, Session> = {}

// Helper to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// Helper to create a session
function createSession(userId: string): string {
  const sessionId = crypto.randomUUID()
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

  sessions[sessionId] = {
    id: sessionId,
    userId,
    expiresAt,
  }

  return sessionId
}

// Helper to get current session
export function getSession(): Session | null {
  const sessionId = cookies().get("session_id")?.value

  if (!sessionId || !sessions[sessionId]) {
    return null
  }

  const session = sessions[sessionId]

  // Check if session is expired
  if (session.expiresAt < Date.now()) {
    cookies().delete("session_id")
    delete sessions[sessionId]
    return null
  }

  return session
}

// Helper to get current user
export function getCurrentUser(): User | null {
  const session = getSession()
  if (!session) return null

  return users[session.userId] || null
}

// Sign up form schema
const SignUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Sign in form schema
const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Sign up action
export async function signUp(formData: FormData) {
  try {
    const validatedFields = SignUpSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { firstName, lastName, email, password } = validatedFields.data

    // Check if user already exists
    const existingUser = Object.values(users).find((user) => user.email === email)
    if (existingUser) {
      return {
        error: {
          email: ["User with this email already exists"],
        },
      }
    }

    // Create user
    const userId = crypto.randomUUID()
    users[userId] = {
      id: userId,
      firstName,
      lastName,
      email,
      passwordHash: hashPassword(password),
    }

    // Create session
    const sessionId = createSession(userId)
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    // Use redirect outside of try/catch to avoid issues
    return { success: true }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      error: {
        form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}

// Sign in action
export async function signIn(formData: FormData) {
  try {
    const validatedFields = SignInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email, password } = validatedFields.data

    // Find user
    const user = Object.values(users).find((user) => user.email === email)
    if (!user || user.passwordHash !== hashPassword(password)) {
      return {
        error: {
          email: ["Invalid email or password"],
        },
      }
    }

    // Create session
    const sessionId = createSession(user.id)
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    // Use redirect outside of try/catch to avoid issues
    return { success: true }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      error: {
        form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}

// Sign out action
export async function signOut() {
  const sessionId = cookies().get("session_id")?.value
  if (sessionId) {
    delete sessions[sessionId]
    cookies().delete("session_id")
  }

  return { success: true }
}
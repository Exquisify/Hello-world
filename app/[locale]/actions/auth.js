"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import crypto from "crypto"
import { revalidatePath } from "next/cache"

// Simple in-memory user store (in a real app, use a database)

// In a real app, this would be a database
const authStore = globalThis.__helloWorldAuthStore ?? { users: {}, sessions: {} }
globalThis.__helloWorldAuthStore = authStore
const users = authStore.users

// Session management
const sessions = authStore.sessions

// Helper to hash passwords
function hashPassword(password) {
 return crypto.createHash("sha256").update(password).digest("hex");
}

// Session management
// Helper to create a session
function createSession(userId) {
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
export async function getSession() {
  const sessionId = cookies().get("session_id")?.value

  if (!sessionId || !sessions[sessionId]) {
    return null
  }

  const session = sessions[sessionId]

  // Check if session is expired
  if (session.expiresAt < Date.now()) {
    delete sessions[sessionId]
    return null
  }

  return session
}

// Helper to get current user
export async function getCurrentUser() {
  const session = await getSession()
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

const SettingsSchema = z.object({
  displayName: z.string().trim().min(2, "Display name must be at least 2 characters").max(60),
  avatar: z.string().max(1_500_000, "Profile picture is too large").refine(
    (value) => !value || value.startsWith("data:image/") || z.string().url().safeParse(value).success,
    "Profile picture must be an image"
  ),
  emailNotifications: z.boolean(),
  inAppNotifications: z.boolean(),
})

export async function toPublicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    displayName: user.displayName ?? `${user.firstName} ${user.lastName}`,
    avatar: user.avatar ?? "",
    notificationPreferences: user.notificationPreferences ?? { email: true, inApp: true },
  }
}

// Sign up action
export async function signUp(formData) {
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
      displayName: `${firstName} ${lastName}`,
      avatar: "",
      notificationPreferences: { email: true, inApp: true },
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
export async function signIn(formData) {
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

export async function updateSettings(_previousState, formData) {
  const user = await getCurrentUser()
  if (!user) return { success: false, message: "You must sign in to update settings." }

  const validated = SettingsSchema.safeParse({
    displayName: formData.get("displayName"),
    avatar: formData.get("avatar") || "",
    emailNotifications: formData.get("emailNotifications") === "true",
    inAppNotifications: formData.get("inAppNotifications") === "true",
  })
  if (!validated.success) {
    return { success: false, message: validated.error.issues[0]?.message ?? "Invalid settings." }
  }

  user.displayName = validated.data.displayName
  user.avatar = validated.data.avatar
  user.notificationPreferences = {
    email: validated.data.emailNotifications,
    inApp: validated.data.inAppNotifications,
  }
  revalidatePath("/", "layout")
  return { success: true, message: "Settings saved." }
}

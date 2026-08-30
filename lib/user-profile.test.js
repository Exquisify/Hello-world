import { describe, expect, it } from "vitest"
import { getUserProfile } from "./user-profile"

describe("getUserProfile", () => {
  it("returns default profile for alexm", () => {
    const profile = getUserProfile("alexm")
    expect(profile).toBeDefined()
    expect(profile.name).toBe("Alex Morgan")
    expect(profile.subscription.tier).toBe("Premium")
    expect(profile.ideas.length).toBeGreaterThan(0)
    expect(profile.votes.length).toBeGreaterThan(0)
  })

  it("returns dynamic fallback profile for arbitrary user id", () => {
    const profile = getUserProfile("dev_user_99")
    expect(profile).toBeDefined()
    expect(profile.id).toBe("dev_user_99")
    expect(profile.subscription.status).toBe("Active")
    expect(profile.ideas.length).toBeGreaterThan(0)
  })

  it("returns logged in user details when user matches logged in user", () => {
    const currentUser = {
      id: "usr_123",
      displayName: "Jane Doe",
      email: "jane@example.com",
      avatar: "https://example.com/avatar.jpg",
    }
    const profile = getUserProfile("usr_123", currentUser)
    expect(profile.id).toBe("usr_123")
    expect(profile.name).toBe("Jane Doe")
    expect(profile.email).toBe("jane@example.com")
  })
})

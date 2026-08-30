import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/[locale]/actions/auth"
import { getUserProfile } from "@/lib/user-profile"

export async function GET(request, { params }) {
  const { userId } = params
  const currentUser = await getCurrentUser()
  const profile = getUserProfile(userId, currentUser)

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  return NextResponse.json({ profile })
}

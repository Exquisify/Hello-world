import { NextResponse } from "next/server"
import { getCurrentUser, toPublicUser } from "@/app/[locale]/actions/auth"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ user: null }, { status: 401 })
  return NextResponse.json({ user: await toPublicUser(user) })
}

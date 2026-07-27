import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser, toPublicUser } from "@/app/[locale]/actions/auth"
import { SettingsForm } from "@/components/settings-form"
import { Button } from "@/components/ui/button"

export default async function SettingsPage({ params: { locale } }) {
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/signIn?next=/${locale}/settings`)

  return (
    <main className="container max-w-3xl px-4 py-10 md:px-6">
      <div className="mb-8 flex items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Settings</h1><p className="mt-2 text-muted-foreground">Manage your profile and notification preferences.</p></div><Button asChild variant="outline"><Link href={`/${locale}/profile`}>View profile</Link></Button></div>
      <SettingsForm user={await toPublicUser(user)} />
    </main>
  )
}

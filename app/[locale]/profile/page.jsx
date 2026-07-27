import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser, toPublicUser } from "@/app/[locale]/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage({ params: { locale } }) {
  const account = await getCurrentUser()
  if (!account) redirect(`/${locale}/signIn?next=/${locale}/profile`)
  const user = await toPublicUser(account)
  const initials = user.displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()

  return (
    <main className="container max-w-3xl px-4 py-10 md:px-6">
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="h-20 w-20"><AvatarImage src={user.avatar} alt={user.displayName} /><AvatarFallback>{initials}</AvatarFallback></Avatar>
          <div><CardTitle className="text-2xl">{user.displayName}</CardTitle><p className="mt-1 text-muted-foreground">{user.email}</p></div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3"><Button asChild><Link href={`/${locale}/settings`}>Edit settings</Link></Button><Button asChild variant="outline"><Link href={`/${locale}/ideas/my-ideas`}>My ideas</Link></Button></CardContent>
      </Card>
    </main>
  )
}

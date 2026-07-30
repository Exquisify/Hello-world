"use client"

import { useRef, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { updateSettings } from "@/app/[locale]/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const initialState = { success: false, message: "" }

function SaveButton() {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save settings"}</Button>
}

export function SettingsForm({ user }) {
  const [state, formAction] = useFormState(updateSettings, initialState)
  const [avatar, setAvatar] = useState(user.avatar ?? "")
  const [emailNotifications, setEmailNotifications] = useState(user.notificationPreferences?.email ?? true)
  const [inAppNotifications, setInAppNotifications] = useState(user.notificationPreferences?.inApp ?? true)
  const fileInput = useRef(null)

  const selectAvatar = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/") || file.size > 1_000_000) {
      event.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => setAvatar(String(reader.result))
    reader.readAsDataURL(file)
  }

  const initials = (user.displayName ?? `${user.firstName} ${user.lastName}`)
    .split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="avatar" value={avatar} />
      <input type="hidden" name="emailNotifications" value={String(emailNotifications)} />
      <input type="hidden" name="inAppNotifications" value={String(inAppNotifications)} />
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Choose how your identity appears across Hello-World.</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20"><AvatarImage src={avatar} alt="Profile preview" /><AvatarFallback>{initials}</AvatarFallback></Avatar>
            <div><Input ref={fileInput} type="file" accept="image/*" onChange={selectAvatar} className="max-w-xs" /><p className="mt-1 text-xs text-muted-foreground">PNG, JPG, GIF, or WebP up to 1 MB.</p></div>
          </div>
          <div className="space-y-2"><Label htmlFor="displayName">Display name</Label><Input id="displayName" name="displayName" defaultValue={user.displayName ?? `${user.firstName} ${user.lastName}`} minLength={2} maxLength={60} required /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={user.email} disabled /><p className="text-xs text-muted-foreground">Email changes require separate account verification.</p></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Control the updates you receive.</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4"><div><Label htmlFor="email-notifications">Email notifications</Label><p className="text-sm text-muted-foreground">Receive important account and idea updates by email.</p></div><Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} /></div>
          <div className="flex items-center justify-between gap-4"><div><Label htmlFor="in-app-notifications">In-app notifications</Label><p className="text-sm text-muted-foreground">Show live notifications while using the platform.</p></div><Switch id="in-app-notifications" checked={inAppNotifications} onCheckedChange={setInAppNotifications} /></div>
        </CardContent>
      </Card>
      {state.message && <p role="status" className={state.success ? "text-sm text-green-600" : "text-sm text-destructive"}>{state.message}</p>}
      <SaveButton />
    </form>
  )
}

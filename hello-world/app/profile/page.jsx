"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/ui/gradient-text"
import Link from "next/link"

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">My Profile</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <h2 className="text-xl font-bold">
            <GradientText>Profile Information</GradientText>
          </h2>
          <p>This is your profile information.</p>
        </TabsContent>
        <TabsContent value="settings">
          <h2 className="text-xl font-bold">
            <GradientText>Settings</GradientText>
          </h2>
          <p>Here you can manage your settings.</p>
        </TabsContent>
        <TabsContent value="ideas">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              <GradientText>My Ideas</GradientText>
            </h2>
            <Link href="/ideas/new">
              <Button>Share New Idea</Button>
            </Link>
          </div>
          <p>Here are your shared ideas.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage

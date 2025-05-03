"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnect } from "@/components/wallet-connect";
import { MobileNav } from "@/components/mobile-nav";
import { SocialIcons } from "@/components/social-icons";
import { GradientText } from "@/components/gradient-text";

export default function NewIdeaPage() {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app, this would be an API call to create the idea
    console.log({
      title,
      content,
      tags,
      isPremium,
    });

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to ideas page after successful submission
      window.location.href = "/ideas";
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 ml-2 md:ml-0">
              <Image
                src="/logo.jpg"
                alt="Hello-World Logo"
                width={32}
                height={32}
                className="rounded-sm"
              />
              <span className="font-bold">Hello-World</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/ideas"
              className="text-sm font-medium underline underline-offset-4"
            >
              Ideas
            </Link>
            <Link
              href="/market"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Market Data
            </Link>
            <Link
              href="/premium"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Premium
            </Link>
            <Link
              href="/community"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Community
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <WalletConnect />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6">
          <Link
            href="/ideas"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Ideas
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <GradientText>Share a New Crypto Idea</GradientText>
            </CardTitle>
            <CardDescription>
              Share your insights, analysis, or predictions with the Hello-World
              community
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, specific title for your idea"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Share your detailed analysis, reasoning, and supporting evidence..."
                  className="min-h-[200px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full hover:bg-muted p-1 h-4 w-4 inline-flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter after each tag)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                />
                <p className="text-xs text-muted-foreground">
                  Add relevant tags to help others discover your idea (e.g.,
                  Bitcoin, Technical Analysis)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="premium"
                  checked={isPremium}
                  onCheckedChange={setIsPremium}
                />
                <Label htmlFor="premium">Mark as Premium Content</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => (window.location.href = "/ideas")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish Idea"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <footer className="border-t py-6 md:py-0 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Hello-World Logo"
              width={24}
              height={24}
              className="rounded-sm"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Hello-World. All rights
              reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SocialIcons />
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-xs sm:text-sm text-muted-foreground hover:underline underline-offset-4"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs sm:text-sm text-muted-foreground hover:underline underline-offset-4"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

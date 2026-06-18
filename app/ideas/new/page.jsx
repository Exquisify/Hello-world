"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Plus,
  Sparkles,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { toast } from "@/components/ui/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnect } from "@/components/wallet-connect";
import { MobileNav } from "@/components/mobile-nav";
import { SocialIcons } from "@/components/social-icons";
import { GradientText } from "@/components/gradient-text";

import { HelloWorldContract } from "@/lib/soroban-contract";
import {
  IDEA_TAG_SUGGESTIONS,
  normalizeIdeaTag,
  validateIdeaDraft,
} from "@/lib/idea-validation";

const STEPS = ["Content", "Tags", "Premium"];

function addUniqueTag(currentTags, candidate) {
  const normalized = normalizeIdeaTag(candidate);
  if (!normalized) return currentTags;
  if (currentTags.some((tag) => tag.toLowerCase() === normalized.toLowerCase()))
    return currentTags;
  return [...currentTags, normalized];
}

export default function NewIdeaPage() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const draft = useMemo(
    () => ({ title, content, tags, isPremium }),
    [title, content, tags, isPremium],
  );
  const validation = useMemo(() => validateIdeaDraft(draft), [draft]);
  const gasFee = validation.metrics.estimatedGasFee;

  const filteredSuggestions = useMemo(() => {
    const query = tagInput.trim().toLowerCase();
    if (!query)
      return IDEA_TAG_SUGGESTIONS.filter(
        (tag) =>
          !tags.some(
            (existing) => existing.toLowerCase() === tag.toLowerCase(),
          ),
      ).slice(0, 6);

    return IDEA_TAG_SUGGESTIONS.filter(
      (tag) =>
        tag.toLowerCase().includes(query) &&
        !tags.some((existing) => existing.toLowerCase() === tag.toLowerCase()),
    ).slice(0, 6);
  }, [tagInput, tags]);

  useEffect(() => {
    setServerError("");
  }, [title, content, tags, isPremium]);

  const handleAddTag = (candidate) => {
    setTags((current) => addUniqueTag(current, candidate));
    setTagInput("");
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.tags;
      return next;
    });
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleAddTag(tagInput);
    }

    if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((current) => current.slice(0, -1));
    }
  };

  const validateCurrentStep = (targetStep = step) => {
    const nextErrors = validateIdeaDraft(draft).errors;
    const scopedErrors = {};

    if (targetStep === 0) {
      if (nextErrors.title?.length) scopedErrors.title = nextErrors.title[0];
      if (nextErrors.content?.length)
        scopedErrors.content = nextErrors.content[0];
    }

    if (targetStep === 1 && nextErrors.tags?.length) {
      scopedErrors.tags = nextErrors.tags[0];
    }

    setFieldErrors(scopedErrors);
    return Object.keys(scopedErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    if (!validateIdeaDraft(draft).valid) {
      setFieldErrors({
        title: validation.errors.title?.[0],
        content: validation.errors.content?.[0],
        tags: validation.errors.tags?.[0],
      });
      setStep(0);
      toast({
        title: "Fix validation errors",
        description: "Review the highlighted fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ideas/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const result = await response.json();

      if (!response.ok) {
        setFieldErrors({
          title: result.errors?.title?.[0],
          content: result.errors?.content?.[0],
          tags: result.errors?.tags?.[0],
        });
        setServerError(result.errors?.form?.[0] || "Server validation failed.");
        setStep(0);
        return;
      }

      await HelloWorldContract.submitIdeaBatch({
        title: result.normalized.title,
        content: result.normalized.content,
        author: "Connected wallet",
        isPremium: result.normalized.isPremium,
        tags: result.normalized.tags,
      });

      toast({
        title: "Idea submitted",
        description: `Queued on-chain with a single batched call. Est. fee ${result.metrics.estimatedGasFee.toFixed(5)} XLM.`,
      });

      window.location.href = "/ideas";
    } catch (error) {
      console.error("Idea submission error:", error);
      setServerError("Unable to submit the idea right now.");
      toast({
        title: "Submission failed",
        description: "Unable to submit the idea right now.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewParagraphs = content
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const previewSummary = content.trim().slice(0, 180);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 ml-2 md:ml-0">
              <Image
                src="/placeholder-logo.svg"
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

        <Card className="overflow-hidden border-border/60 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>
              <GradientText>Share a New Crypto Idea</GradientText>
            </CardTitle>
            <CardDescription>
              Build, preview, validate, and submit a blockchain-ready idea in
              three steps.
            </CardDescription>
            <div className="mt-4 flex flex-wrap gap-2">
              {STEPS.map((label, index) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${step === index ? "border-primary bg-primary/10 text-primary" : index < step ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600" : "border-border text-muted-foreground"}`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-semibold">
                    {index + 1}
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="title">Title</Label>
                      <span className="text-xs text-muted-foreground">
                        {title.length}/120
                      </span>
                    </div>
                    <Input
                      id="title"
                      placeholder="Enter a clear, specific title for your idea"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      aria-invalid={Boolean(fieldErrors.title)}
                    />
                    {fieldErrors.title && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="content">Content</Label>
                      <span className="text-xs text-muted-foreground">
                        {content.length}/5000
                      </span>
                    </div>
                    <Textarea
                      id="content"
                      placeholder="Share your detailed analysis, reasoning, and supporting evidence..."
                      className="min-h-[240px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      aria-invalid={Boolean(fieldErrors.content)}
                    />
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                        <Clock3 className="h-3 w-3" /> Minimum 180 chars
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                        <Sparkles className="h-3 w-3" /> Use at least two
                        paragraphs
                      </span>
                    </div>
                    {fieldErrors.content && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.content}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock3 className="h-4 w-4" /> Preview summary
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPreviewOpen(true)}
                      >
                        Open preview
                      </Button>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {previewSummary ||
                        "Your preview summary appears here as you type."}
                    </p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() =>
                              setTags((current) =>
                                current.filter((item) => item !== tag),
                              )
                            }
                            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-xs hover:bg-background/60"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      id="tags"
                      placeholder="Type a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    <div className="flex flex-wrap gap-2">
                      {filteredSuggestions.map((suggestion) => (
                        <Button
                          key={suggestion}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTag(suggestion)}
                        >
                          <Plus className="mr-1 h-3 w-3" /> {suggestion}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add up to 6 tags. Suggestions update as you type.
                    </p>
                    {fieldErrors.tags && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.tags}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <ShieldCheck className="h-4 w-4" /> Premium gate
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Premium ideas are highlighted and charged a slightly
                          higher network fee.
                        </p>
                      </div>
                      <Switch
                        id="premium"
                        checked={isPremium}
                        onCheckedChange={setIsPremium}
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-lg border bg-background p-3">
                      <div>
                        <p className="text-sm font-medium">Estimated gas fee</p>
                        <p className="text-xs text-muted-foreground">
                          Based on title, content size, tags, and premium flag.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {gasFee.toFixed(5)} XLM
                        </p>
                        <p className="text-xs text-muted-foreground inline-flex items-center gap-1 justify-end">
                          <Wallet className="h-3 w-3" /> Contract call batching
                          enabled
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border bg-background p-4">
                    <p className="text-sm font-medium">Submission checklist</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li>Content is validated client-side and server-side.</li>
                      <li>
                        The blockchain call is delayed until the server accepts
                        the draft.
                      </li>
                      <li>Tags are sent in a single batched payload.</li>
                    </ul>
                  </div>
                </div>
              )}

              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t bg-muted/20 sm:flex-row sm:justify-between">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (window.location.href = "/ideas")}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  Preview
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-36"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isSubmitting ? "Publishing..." : "Publish Idea"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Idea preview</DialogTitle>
              <DialogDescription>
                Review the exact payload before it is validated and queued
                on-chain.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Title
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {title.trim() || "Preview your idea title"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Content
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {content.trim() ||
                    "Your analysis will appear here before submission."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tags added yet.
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Premium status</p>
                  <p className="text-xs text-muted-foreground">
                    {isPremium ? "This idea is premium." : "This idea is free."}
                  </p>
                </div>
                <Badge variant={isPremium ? "secondary" : "outline"}>
                  {isPremium ? "Premium" : "Free"}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <footer className="border-t py-6 md:py-0 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder-logo.svg"
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

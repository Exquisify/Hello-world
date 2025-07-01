import Link from "next/link";
import { Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnect } from "@/components/wallet-connect";
import { MobileNav } from "@/components/mobile-nav";
import { GradientText } from "@/components/gradient-text";
import { SocialIcons } from "@/components/social-icons";
import Image from "next/image";

export default function PremiumPage() {
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
              className="text-sm font-medium hover:underline underline-offset-4"
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
              className="text-sm font-medium underline underline-offset-4"
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
          <div className="flex items-center gap-4">
            <WalletConnect />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-primary">Premium Membership</span>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <GradientText>Unlock Expert Crypto Insights</GradientText>
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get exclusive access to premium content, expert analysis, and
                  advanced trading strategies
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <GradientText>Basic</GradientText>
                  </CardTitle>
                  <CardDescription>
                    Free access to community ideas
                  </CardDescription>
                  <div className="mt-4 text-4xl font-bold">$0</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Access to public ideas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Basic market data</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Community discussions</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Current Plan
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      <GradientText>Pro</GradientText>
                    </CardTitle>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Popular
                    </span>
                  </div>
                  <CardDescription>
                    Premium content and analysis
                  </CardDescription>
                  <div className="mt-4 text-4xl font-bold">$29</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Access to premium ideas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Advanced market analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Weekly market reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Subscribe Now</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    <GradientText>Enterprise</GradientText>
                  </CardTitle>
                  <CardDescription>
                    Institutional-grade insights
                  </CardDescription>
                  <div className="mt-4 text-4xl font-bold">$99</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Institutional-grade research</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Direct access to analysts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Custom market reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>API access</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  <GradientText>Frequently Asked Questions</GradientText>
                </h2>
                <p className="text-muted-foreground">
                  Find answers to common questions about our premium membership
                </p>
              </div>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I access premium content?
                  </h3>
                  <p className="text-muted-foreground">
                    After subscribing, you'll immediately gain access to all
                    premium content. Premium ideas are marked with a badge and
                    are accessible only to subscribers.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Can I cancel my subscription?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time. Your
                    access will remain active until the end of your billing
                    period.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Do you offer refunds?
                  </h3>
                  <p className="text-muted-foreground">
                    We offer a 7-day money-back guarantee if you're not
                    satisfied with your premium membership.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    How do I connect my wallet?
                  </h3>
                  <p className="text-muted-foreground">
                    Click on the "Connect Wallet" button in the navigation bar
                    and follow the instructions to connect your StarkNet wallet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
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

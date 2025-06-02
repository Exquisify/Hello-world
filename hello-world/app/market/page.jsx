import Link from "next/link";
import Image from "next/image";

import { MarketOverview } from "@/components/market-overview";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnect } from "@/components/wallet-connect";
import { MobileNav } from "@/components/mobile-nav";
import { GradientText } from "@/components/gradient-text";

export default function MarketPage() {
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
							className="text-sm font-medium underline underline-offset-4"
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
			<main className="flex-1">
				<div className="container px-4 py-6 md:px-6 md:py-8 lg:py-12">
					<h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
						<GradientText>Crypto Market Data</GradientText>
					</h1>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<MarketOverview />

						<div className="space-y-4">
							<h2 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
								<GradientText>Top Gainers</GradientText>
							</h2>
							<div className="border rounded-lg p-4 bg-background">
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											<div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center">
												<span className="text-green-600 text-xs font-bold">
													SOL
												</span>
											</div>
											<span className="text-sm md:text-base">Solana</span>
										</div>
										<div className="text-green-500 text-sm md:text-base">
											+8.4%
										</div>
									</div>

									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											<div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-100 flex items-center justify-center">
												<span className="text-blue-600 text-xs font-bold">
													AVAX
												</span>
											</div>
											<span className="text-sm md:text-base">Avalanche</span>
										</div>
										<div className="text-green-500 text-sm md:text-base">
											+6.2%
										</div>
									</div>

									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											<div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-100 flex items-center justify-center">
												<span className="text-purple-600 text-xs font-bold">
													DOT
												</span>
											</div>
											<span className="text-sm md:text-base">Polkadot</span>
										</div>
										<div className="text-green-500 text-sm md:text-base">
											+5.7%
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h2 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
								<GradientText>Market Sentiment</GradientText>
							</h2>
							<div className="border rounded-lg p-4 bg-background">
								<div className="flex flex-col items-center justify-center h-full">
									<div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-6 md:border-8 border-green-500 flex items-center justify-center mb-4">
										<span className="text-xl md:text-2xl font-bold">
											Bullish
										</span>
									</div>
									<p className="text-center text-xs md:text-sm text-muted-foreground">
										Market sentiment is currently bullish with strong
										institutional buying signals
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-8 md:mt-12">
						<h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
							<GradientText>Market News</GradientText>
						</h2>
						<div className="space-y-4 md:space-y-6">
							<div className="border rounded-lg p-4 md:p-6 bg-background">
								<h3 className="text-lg md:text-xl font-semibold mb-2 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
									<GradientText>
										Bitcoin ETF Inflows Reach New Heights
									</GradientText>
								</h3>
								<p className="text-sm md:text-base text-muted-foreground mb-4">
									Bitcoin ETFs have seen record inflows this week, with over
									$500 million in new investments.
								</p>
								<div className="flex justify-between items-center">
									<span className="text-xs md:text-sm text-muted-foreground">
										3 hours ago
									</span>
									<Link
										href="#"
										className="text-xs md:text-sm text-primary hover:underline"
									>
										Read more
									</Link>
								</div>
							</div>

							<div className="border rounded-lg p-4 md:p-6 bg-background">
								<h3 className="text-lg md:text-xl font-semibold mb-2 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
									<GradientText>
										Ethereum Layer 2 Solutions See Increased Adoption
									</GradientText>
								</h3>
								<p className="text-sm md:text-base text-muted-foreground mb-4">
									Ethereum scaling solutions are experiencing a surge in user
									activity, with total value locked reaching all-time highs.
								</p>
								<div className="flex justify-between items-center">
									<span className="text-xs md:text-sm text-muted-foreground">
										8 hours ago
									</span>
									<Link
										href="#"
										className="text-xs md:text-sm text-primary hover:underline"
									>
										Read more
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
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
			</footer>
		</div>
	);
}

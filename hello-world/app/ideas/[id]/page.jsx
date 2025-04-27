"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ChevronUp, ChevronDown, Share2, Eye, MessageSquare, Bookmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { GradientText } from "@/components/gradient-text"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { MobileNav } from "@/components/mobile-nav"
import { SocialIcons } from "@/components/social-icons"
import { mockComments } from "@/components/comment-modal"

// Sample data - in a real app, this would come from an API
const ideas = [
    {
        id: 1,
        title: "Bitcoin likely to break $50k resistance by Q2 2024",
        content:
            "Based on current market trends and institutional adoption, I believe Bitcoin will break through the $50,000 resistance level by Q2 2024. Key indicators include increased institutional buying and reduced selling pressure from miners.\n\nThe recent approval of Bitcoin ETFs has brought significant institutional capital into the market, with inflows exceeding expectations. This new demand, combined with the upcoming halving event in April 2024, creates a perfect storm for price appreciation.\n\nTechnical analysis shows that the $50,000 level has been tested multiple times and serves as a psychological barrier. Once this resistance is broken, I expect momentum to carry the price toward the previous all-time high.\n\nRisk factors to consider include regulatory developments, particularly in the US and EU, as well as macroeconomic conditions that might affect risk assets broadly. However, Bitcoin's increasing adoption as an inflation hedge by corporations and sovereign wealth funds provides a strong foundation for sustained growth.",
        author: {
            name: "CryptoAnalyst",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        date: "2 hours ago",
        votes: 24,
        comments: 8,
        views: 342,
        tags: ["Bitcoin", "Technical Analysis", "Price Prediction"],
        premium: true,
        relatedIdeas: [2, 5, 8],
    },
    {
        id: 2,
        title: "Ethereum's shift to PoS will drive 30% price increase",
        content:
            "Ethereum's successful transition to Proof of Stake has significantly reduced its energy consumption. This environmental benefit, combined with the reduced issuance rate, creates a strong case for a 30% price increase in the next market cycle.",
        author: {
            name: "ETHDeveloper",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        date: "5 hours ago",
        votes: 18,
        comments: 12,
        views: 256,
        tags: ["Ethereum", "PoS", "Sustainability"],
        premium: false,
        relatedIdeas: [3, 7, 10],
    },
    {
        id: 3,
        title: "StarkNet ecosystem growth opportunities",
        content:
            "StarkNet's Layer 2 scaling solution is gaining significant traction. Projects building on StarkNet are seeing increased adoption due to lower fees and faster transactions. This presents a unique investment opportunity for early adopters.",
        author: {
            name: "L2Enthusiast",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        date: "1 day ago",
        votes: 42,
        comments: 15,
        views: 587,
        tags: ["StarkNet", "Layer 2", "Scaling", "Investment"],
        premium: false,
        relatedIdeas: [2, 7, 9],
    },
]

export default function IdeaDetailPage() {
    const params = useParams()
    const router = useRouter()
    const ideaId = Number(params.id)
    const [idea, setIdea] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [voteStatus, setVoteStatus] = useState(0) // 0: not voted, 1: upvoted, -1: downvoted
    const [isSaved, setIsSaved] = useState(false)
    const [relatedIdeas, setRelatedIdeas] = useState([])

    useEffect(() => {
        // In a real app, this would be an API call
        const foundIdea = ideas.find((i) => i.id === ideaId)
        if (foundIdea) {
            setIdea(foundIdea)

            // Get related ideas
            if (foundIdea.relatedIdeas) {
                const related = ideas.filter((i) => foundIdea.relatedIdeas.includes(i.id))
                setRelatedIdeas(related)
            }

            // Get comments
            const ideaComments = mockComments[ideaId] || []
            setComments(ideaComments)
        } else {
            // Idea not found, redirect to ideas page
            router.push("/ideas")
        }
    }, [ideaId, router])

    const handleVote = (direction) => {
        if (voteStatus === direction) {
            setVoteStatus(0)
            setIdea((prev) => ({ ...prev, votes: direction === 1 ? prev.votes - 1 : prev.votes + 1 }))
        } else {
            // If changing vote direction, adjust by 2
            if (voteStatus !== 0) {
                setIdea((prev) => ({
                    ...prev,
                    votes: direction === 1 ? prev.votes + 2 : prev.votes - 2,
                }))
            } else {
                setIdea((prev) => ({
                    ...prev,
                    votes: direction === 1 ? prev.votes + 1 : prev.votes - 1,
                }))
            }
            setVoteStatus(direction)
        }
    }

    const handleAddComment = () => {
        if (!newComment.trim()) return

        const comment = {
            id: comments.length + 1,
            author: {
                name: "You",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: newComment,
            date: "Just now",
        }

        setComments([comment, ...comments])
        setNewComment("")

        // Update comment count
        setIdea((prev) => ({ ...prev, comments: prev.comments + 1 }))
    }

    if (!idea) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center">
                        <MobileNav />
                        <Link href="/" className="flex items-center gap-2 ml-2 md:ml-0">
                            <Image src="/logo.jpg" alt="Hello-World Logo" width={32} height={32} className="rounded-sm" />
                            <span className="font-bold">Hello-World</span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex gap-6">
                        <Link href="/ideas" className="text-sm font-medium underline underline-offset-4">
                            Ideas
                        </Link>
                        <Link href="/market" className="text-sm font-medium hover:underline underline-offset-4">
                            Market Data
                        </Link>
                        <Link href="/premium" className="text-sm font-medium hover:underline underline-offset-4">
                            Premium
                        </Link>
                        <Link href="/community" className="text-sm font-medium hover:underline underline-offset-4">
                            Community
                        </Link>
                    </nav>
                    <div className="flex items-center gap-2 md:gap-4">
                        <WalletConnect />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <div className="container px-4 py-6 md:px-6 md:py-8">
                <div className="mb-6">
                    <Link href="/ideas" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Ideas
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleVote(1)}
                                            className={voteStatus === 1 ? "text-primary" : ""}
                                        >
                                            <ChevronUp className="h-5 w-5" />
                                        </Button>
                                        <span className="text-lg font-medium">{idea.votes} upvotes</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleVote(-1)}
                                            className={voteStatus === -1 ? "text-destructive" : ""}
                                        >
                                            <ChevronDown className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold mb-2">
                                            <GradientText>{idea.title}</GradientText>
                                        </h1>
                                        <div className="flex items-center gap-3 mb-4">
                                            <Avatar>
                                                <AvatarImage src={idea.author.avatar || "/placeholder.svg"} alt={idea.author.name} />
                                                <AvatarFallback>{idea.author.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{idea.author.name}</div>
                                                <div className="text-sm text-muted-foreground">{idea.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {idea.tags.map((tag) => (
                                                <Badge key={tag} variant="outline">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {idea.premium && <Badge variant="secondary">Premium</Badge>}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                <span>{idea.views} views</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{idea.comments} comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none">
                                    {idea.content.split("\n\n").map((paragraph, index) => (
                                        <p key={index} className="mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => setIsSaved(!isSaved)}
                                    >
                                        {isSaved ? <Bookmark className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
                                        <span>{isSaved ? "Saved" : "Save"}</span>
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                    <Share2 className="h-4 w-4" />
                                    <span>Share</span>
                                </Button>
                            </CardFooter>
                        </Card>

                        <div className="mt-6">
                            <h2 className="text-xl font-bold mb-4">
                                <GradientText>Comments ({comments.length})</GradientText>
                            </h2>

                            <div className="mb-6">
                                <Textarea
                                    placeholder="Add your comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-[100px] mb-2"
                                />
                                <Button onClick={handleAddComment}>Post Comment</Button>
                            </div>

                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <Card key={comment.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-start gap-3">
                                                <Avatar>
                                                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                                                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{comment.author.name}</span>
                                                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                                                    </div>
                                                    <p className="text-sm">{comment.content}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-bold">
                                    <GradientText>Related Ideas</GradientText>
                                </h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {relatedIdeas.map((relatedIdea) => (
                                    <div key={relatedIdea.id} className="border-b pb-4 last:border-0 last:pb-0">
                                        <Link href={`/ideas/${relatedIdea.id}`} className="hover:underline">
                                            <h3 className="font-medium mb-1">{relatedIdea.title}</h3>
                                        </Link>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{relatedIdea.author.name}</span>
                                            <span>•</span>
                                            <span>{relatedIdea.votes} votes</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-bold">
                                    <GradientText>Trending Tags</GradientText>
                                </h2>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                        Bitcoin
                                    </Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                        Ethereum
                                    </Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                        DeFi
                                    </Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                        Layer 2
                                    </Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                        NFT
                                    </Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                        Regulation
                                    </Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                        StarkNet
                                    </Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                        Technical Analysis
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <footer className="border-t py-6 md:py-0 mt-auto">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.jpg" alt="Hello-World Logo" width={24} height={24} className="rounded-sm" />
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Hello-World. All rights reserved.
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
    )
}
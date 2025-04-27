"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from "lucide-react"
import { GradientText } from "@/components/gradient-text"

// Mock comments data
export const mockComments = {
    1: [
        {
            id: 1,
            author: {
                name: "CryptoTrader",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "I agree with your analysis. The institutional adoption we're seeing is unprecedented.",
            date: "1 hour ago",
        },
        {
            id: 2,
            author: {
                name: "BTCMaximalist",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "What about the impact of the upcoming halving? Do you think that's already priced in?",
            date: "2 hours ago",
        },
        {
            id: 3,
            author: {
                name: "TechAnalyst",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "The resistance at $48k has been tested multiple times. Once we break through, $50k is inevitable.",
            date: "3 hours ago",
        },
    ],
    2: [
        {
            id: 1,
            author: {
                name: "ETHBeliver",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "The reduced issuance rate is a game-changer. ETH is becoming deflationary during high network usage.",
            date: "30 minutes ago",
        },
        {
            id: 2,
            author: {
                name: "DeFiDeveloper",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content:
                "I'm more excited about the improvements to scalability. Layer 2 solutions are making ETH more accessible.",
            date: "1 hour ago",
        },
    ],
    3: [
        {
            id: 1,
            author: {
                name: "L2Enthusiast",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "StarkNet's composability is unmatched among ZK rollups. This is why I believe it will win the L2 race.",
            date: "45 minutes ago",
        },
        {
            id: 2,
            author: {
                name: "ZKProver",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content:
                "The developer tooling has improved dramatically in the last few months. Cairo is becoming much more accessible.",
            date: "2 hours ago",
        },
        {
            id: 3,
            author: {
                name: "ScalingSpecialist",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "What are your thoughts on StarkNet vs zkSync? Both have strong value propositions.",
            date: "3 hours ago",
        },
        {
            id: 4,
            author: {
                name: "CryptoResearcher",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content:
                "The recent partnership announcements are bullish. More projects are choosing StarkNet for their scaling needs.",
            date: "5 hours ago",
        },
    ],
    4: [
        {
            id: 1,
            author: {
                name: "YieldFarmer",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content:
                "I've been using similar strategies. The key is to diversify across multiple protocols to minimize smart contract risk.",
            date: "20 minutes ago",
        },
        {
            id: 2,
            author: {
                name: "RiskManager",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "What's your take on using options strategies for hedging in this market?",
            date: "1 hour ago",
        },
    ],
}

export function CommentModal({ ideaId, commentCount }) {
    const [comments, setComments] = useState(mockComments[ideaId] || [])
    const [newComment, setNewComment] = useState("")

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
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{commentCount} comments</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        <GradientText>Comments</GradientText>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    <div className="flex gap-2">
                        <Textarea
                            placeholder="Add your comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[80px]"
                        />
                    </div>
                    <Button onClick={handleAddComment} className="w-full">
                        Post Comment
                    </Button>

                    <div className="space-y-4 pt-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="border rounded-lg p-4">
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
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
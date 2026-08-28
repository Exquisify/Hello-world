import { ideas } from "@/lib/ideas"

// Default demo profiles
const MOCK_PROFILES = {
  alexm: {
    id: "alexm",
    name: "Alex Morgan",
    username: "@alexm",
    email: "alex.morgan@example.com",
    joined: "Member since January 2024",
    bio: "Web3 researcher & crypto analyst passionate about Stellar and DeFi.",
    avatar: "",
    subscription: {
      tier: "Premium",
      status: "Active",
      expiresAt: "August 24, 2026",
      renewsAutomatically: true,
      features: ["Unlimited Idea Publishing", "Advanced Market Sentiment Summaries", "Priority Community Voting", "Exclusive Pro & Premium Signal Feed"],
    },
    ideas: [
      {
        id: 101,
        title: "AI-powered market sentiment summaries",
        excerpt: "A compact tool that turns community activity into straightforward buy and sell signals.",
        createdAt: "March 12, 2026",
        publishedAt: "2026-03-12T10:00:00.000Z",
        votes: 24,
        status: "Trending",
        category: "AI & Data",
        tags: ["AI", "Sentiment", "Analytics"],
      },
      {
        id: 102,
        title: "Community-curated launch calendar",
        excerpt: "A shared calendar that highlights upcoming token launches and milestones.",
        createdAt: "February 8, 2026",
        publishedAt: "2026-02-08T14:30:00.000Z",
        votes: 16,
        status: "Reviewing",
        category: "Community",
        tags: ["Calendar", "Launches", "Web3"],
      },
    ],
    votes: [
      {
        id: 1,
        ideaId: 1,
        idea: "Bitcoin likely to break $50k resistance",
        createdAt: "April 2, 2026",
        direction: "Upvoted",
        weight: 3,
      },
      {
        id: 2,
        ideaId: 3,
        idea: "Stellar DeFi ecosystem growth on Soroban",
        createdAt: "March 19, 2026",
        direction: "Upvoted",
        weight: 2,
      },
      {
        id: 3,
        ideaId: 4,
        idea: "Layer 2 networks enter their next phase",
        createdAt: "March 5, 2026",
        direction: "Downvoted",
        weight: 1,
      },
    ],
  },
  CryptoAnalyst: {
    id: "CryptoAnalyst",
    name: "CryptoAnalyst",
    username: "@cryptoanalyst",
    email: "analyst@example.com",
    joined: "Member since June 2023",
    bio: "Focused on technical analysis and Bitcoin macro cycles.",
    avatar: "",
    subscription: {
      tier: "Pro",
      status: "Active",
      expiresAt: "November 15, 2026",
      renewsAutomatically: true,
      features: ["Unlimited Idea Publishing", "Advanced Market Sentiment Summaries", "Priority Community Voting"],
    },
    ideas: [ideas[0]],
    votes: [
      {
        id: 1,
        ideaId: 2,
        idea: "Ethereum proof-of-stake adoption outlook",
        createdAt: "May 10, 2026",
        direction: "Upvoted",
        weight: 5,
      },
    ],
  },
}

export function getUserProfile(userId, currentUser = null) {
  // If user requests "me" or matching logged-in user
  if (currentUser && (userId === "me" || userId === currentUser.id || userId === currentUser.email)) {
    return {
      id: currentUser.id,
      name: currentUser.displayName || `${currentUser.firstName || "User"} ${currentUser.lastName || ""}`.trim() || "Anonymous User",
      username: currentUser.email ? `@${currentUser.email.split("@")[0]}` : "@user",
      email: currentUser.email || "",
      joined: "Member since 2024",
      bio: "Active crypto community contributor.",
      avatar: currentUser.avatar || "",
      subscription: currentUser.subscription || {
        tier: "Premium",
        status: "Active",
        expiresAt: "August 24, 2026",
        renewsAutomatically: true,
        features: ["Unlimited Idea Publishing", "Advanced Market Sentiment Summaries", "Priority Community Voting"],
      },
      ideas: MOCK_PROFILES.alexm.ideas,
      votes: MOCK_PROFILES.alexm.votes,
    }
  }

  if (userId && MOCK_PROFILES[userId]) {
    return MOCK_PROFILES[userId]
  }

  // Fallback for any dynamic userId
  const cleanId = String(userId || "user")
  return {
    id: cleanId,
    name: cleanId.charAt(0).toUpperCase() + cleanId.slice(1).replace(/[-_]/g, " "),
    username: `@${cleanId.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    email: `${cleanId}@example.com`,
    joined: "Member since 2024",
    bio: "Web3 enthusiast & builder.",
    avatar: "",
    subscription: {
      tier: "Pro",
      status: "Active",
      expiresAt: "December 31, 2026",
      renewsAutomatically: true,
      features: ["Unlimited Idea Publishing", "Community Voting"],
    },
    ideas: [
      {
        id: 201,
        title: `Decentralized identity protocol proposal by ${cleanId}`,
        excerpt: "An open standard for verifying identity across Stellar and EVM chains.",
        createdAt: "May 4, 2026",
        publishedAt: "2026-05-04T12:00:00.000Z",
        votes: 19,
        status: "Published",
        category: "Identity",
        tags: ["Identity", "Stellar", "Cross-Chain"],
      },
    ],
    votes: [
      {
        id: 1,
        ideaId: 1,
        idea: "Bitcoin likely to break $50k resistance",
        createdAt: "June 1, 2026",
        direction: "Upvoted",
        weight: 1,
      },
    ],
  }
}

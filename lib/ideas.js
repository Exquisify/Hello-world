export const ideas = [
  { id: 1, title: "Bitcoin likely to break $50k resistance", excerpt: "Institutional adoption and market structure point to a strong Bitcoin breakout.", author: "CryptoAnalyst", publishedAt: "2026-07-22T09:00:00.000Z", votes: 124, category: "Bitcoin", tags: ["Bitcoin", "Technical Analysis", "Trading"], premium: true },
  { id: 2, title: "Ethereum proof-of-stake adoption outlook", excerpt: "Lower energy use creates a stronger long-term investment case for Ethereum.", author: "ETHDeveloper", publishedAt: "2026-07-21T15:00:00.000Z", votes: 78, category: "Ethereum", tags: ["Ethereum", "Fundamental Analysis", "Investment"], premium: false },
  { id: 3, title: "Stellar DeFi ecosystem growth on Soroban", excerpt: "Soroban smart contracts are gaining traction through low fees and fast finality.", author: "StellarBuilder", publishedAt: "2026-07-20T12:00:00.000Z", votes: 142, category: "Stellar", tags: ["Stellar", "DeFi", "Soroban"], premium: false },
  { id: 4, title: "Layer 2 networks enter their next phase", excerpt: "Rollup interoperability may be the next major driver of Ethereum scaling.", author: "RollupResearcher", publishedAt: "2026-07-18T10:30:00.000Z", votes: 56, category: "Layer 2", tags: ["Layer 2", "Technical Analysis"], premium: true },
  { id: 5, title: "NFT utility expands beyond collectibles", excerpt: "Membership and identity applications are bringing measurable utility to NFTs.", author: "Web3Creator", publishedAt: "2026-07-16T08:15:00.000Z", votes: 31, category: "NFTs", tags: ["NFTs", "News"], premium: false },
]

export function searchIdeas(source, filters) {
  const query = (filters.query ?? "").trim().toLowerCase()
  const tags = filters.tags ?? []
  const authors = filters.authors ?? []

  return source.filter((idea) => {
    const haystack = `${idea.title} ${idea.excerpt} ${idea.author} ${idea.tags.join(" ")}`.toLowerCase()
    if (query && !haystack.includes(query)) return false
    if (filters.category && idea.category !== filters.category) return false
    if (tags.length && !tags.every((tag) => idea.tags.includes(tag))) return false
    if (filters.contentType === "premium" && !idea.premium) return false
    if (filters.contentType === "free" && idea.premium) return false
    if (authors.length && !authors.includes(idea.author)) return false
    if (filters.voteMin !== undefined && idea.votes < filters.voteMin) return false
    if (filters.voteMax !== undefined && idea.votes > filters.voteMax) return false
    if (filters.dateFrom && new Date(idea.publishedAt) < new Date(filters.dateFrom)) return false
    if (filters.dateTo && new Date(idea.publishedAt) > new Date(filters.dateTo)) return false
    return true
  })
}

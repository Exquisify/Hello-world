export const IDEA_TAG_SUGGESTIONS = [
  "Bitcoin",
  "Ethereum",
  "Stellar",
  "Soroban",
  "DeFi",
  "Technical Analysis",
  "Fundamental Analysis",
  "Price Prediction",
  "Liquidity",
  "Adoption",
  "Roadmap",
  "Security",
  "On-chain",
  "Governance",
];

const TITLE_MIN_LENGTH = 12;
const TITLE_MAX_LENGTH = 120;
const CONTENT_MIN_LENGTH = 180;
const CONTENT_MAX_LENGTH = 5000;
const TAG_MAX_LENGTH = 24;
const TAG_LIMIT = 6;

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeIdeaTag(tag) {
  return normalizeWhitespace(String(tag || "")).replace(/[.,;:]+$/g, "");
}

export function estimateIdeaGasFee({ content, tags, isPremium }) {
  const charCost = Math.ceil(content.length / 250) * 0.00003;
  const tagCost = tags.length * 0.00004;
  const premiumCost = isPremium ? 0.00018 : 0;
  const baseCost = 0.00012;

  return Number((baseCost + charCost + tagCost + premiumCost).toFixed(5));
}

export function buildIdeaBatchPlan(idea) {
  return {
    callCount: 1,
    operations: ["local-validation", "server-validation", "create_idea"],
    payloadSize: JSON.stringify(idea).length,
  };
}

export function validateIdeaDraft(draft) {
  const errors = {
    title: [],
    content: [],
    tags: [],
    premium: [],
    form: [],
  };

  const title = normalizeWhitespace(draft.title || "");
  const content = String(draft.content || "").trim();
  const tags = Array.isArray(draft.tags)
    ? draft.tags.map((tag) => normalizeIdeaTag(tag)).filter(Boolean)
    : [];
  const isPremium = Boolean(draft.isPremium);

  if (!title) {
    errors.title.push("Title is required.");
  } else {
    if (title.length < TITLE_MIN_LENGTH) {
      errors.title.push(
        `Title must be at least ${TITLE_MIN_LENGTH} characters.`,
      );
    }
    if (title.length > TITLE_MAX_LENGTH) {
      errors.title.push(
        `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`,
      );
    }
    if (/^https?:\/\//i.test(title)) {
      errors.title.push("Title cannot be a URL.");
    }
  }

  if (!content) {
    errors.content.push("Idea content is required.");
  } else {
    if (content.length < CONTENT_MIN_LENGTH) {
      errors.content.push(
        `Content must be at least ${CONTENT_MIN_LENGTH} characters.`,
      );
    }
    if (content.length > CONTENT_MAX_LENGTH) {
      errors.content.push(
        `Content must be ${CONTENT_MAX_LENGTH} characters or fewer.`,
      );
    }

    const paragraphs = content
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    const sentences = content
      .split(/[.!?]+\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    if (paragraphs.length < 2 && sentences.length < 3) {
      errors.content.push(
        "Use at least two short paragraphs or three complete sentences.",
      );
    }
    if (content.split(/\s+/).filter(Boolean).length < 35) {
      errors.content.push("Add more supporting detail before submitting.");
    }
  }

  const uniqueTags = [];
  const seenTags = new Set();
  for (const tag of tags) {
    const key = tag.toLowerCase();
    if (!seenTags.has(key)) {
      seenTags.add(key);
      uniqueTags.push(tag);
    }
  }

  if (uniqueTags.length === 0) {
    errors.tags.push("Add at least one relevant tag.");
  }
  if (uniqueTags.length > TAG_LIMIT) {
    errors.tags.push(`You can add up to ${TAG_LIMIT} tags.`);
  }
  uniqueTags.forEach((tag) => {
    if (tag.length < 2) {
      errors.tags.push("Tags must be at least 2 characters long.");
    }
    if (tag.length > TAG_MAX_LENGTH) {
      errors.tags.push(`Tags must be ${TAG_MAX_LENGTH} characters or fewer.`);
    }
  });

  const normalized = {
    title,
    content,
    tags: uniqueTags,
    isPremium,
  };

  const metrics = {
    titleLength: title.length,
    contentLength: content.length,
    wordCount: content.split(/\s+/).filter(Boolean).length,
    tagCount: uniqueTags.length,
    paragraphCount: content
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean).length,
    estimatedGasFee: estimateIdeaGasFee(normalized),
  };

  return {
    valid: Object.values(errors).every(
      (fieldErrors) => fieldErrors.length === 0,
    ),
    errors,
    normalized,
    metrics,
    batchPlan: buildIdeaBatchPlan(normalized),
  };
}

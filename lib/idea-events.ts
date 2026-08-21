import { rpc, scValToNative } from "@stellar/stellar-sdk";

import type { IdeaContractEvent, IdeaData } from "./soroban-contract";

const DEFAULT_RPC_URL = "https://soroban-testnet.stellar.org";

function jsonSafe(value: unknown): unknown {
  // Contract identifiers can be u64 values, so keep their exact value until
  // each event field is normalized below instead of risking IEEE-754 loss.
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        jsonSafe(entry),
      ]),
    );
  }
  return value;
}

function normalizedName(topics: unknown[]) {
  return topics
    .map(String)
    .join(".")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
}

export function normalizeIdeaEvent({
  eventId,
  topics,
  value,
}: {
  eventId: string;
  topics: unknown[];
  value: unknown;
}): IdeaContractEvent | null {
  const name = normalizedName(topics);
  const data = jsonSafe(value) as Record<string, unknown>;

  if (name.includes("create_idea") || name.includes("idea_created")) {
    const rawIdea = (data.idea && typeof data.idea === "object"
      ? data.idea
      : data) as unknown as IdeaData & Record<string, unknown>;
    if (rawIdea.id === undefined || !rawIdea.title) return null;
    const idea = {
      ...rawIdea,
      id: String(rawIdea.id),
      excerpt: rawIdea.excerpt ?? "",
      author: rawIdea.author ?? "Stellar account",
      tags: Array.isArray(rawIdea.tags) ? rawIdea.tags : [],
      votes: Number(rawIdea.votes ?? 0),
      premium: Boolean(rawIdea.premium ?? rawIdea.isPremium),
      publishedAt:
        rawIdea.publishedAt ??
        (rawIdea.timestamp
          ? new Date(Number(rawIdea.timestamp) * 1_000).toISOString()
          : new Date().toISOString()),
    } as unknown as IdeaData;
    return { eventId, type: "idea.created", idea };
  }

  if (name.includes("vote_idea") || name.includes("idea_voted")) {
    const ideaId = data.ideaId ?? data.idea_id ?? data.id;
    if (ideaId === undefined) return null;
    const votes = data.votes === undefined ? undefined : Number(data.votes);
    const delta = data.delta === undefined ? undefined : Number(data.delta);
    return {
      eventId,
      type: "idea.voted",
      ideaId: String(ideaId),
      votes,
      delta,
    };
  }
  return null;
}

export async function latestLedgerSequence() {
  const server = new rpc.Server(process.env.SOROBAN_RPC_URL || DEFAULT_RPC_URL);
  const ledger = await server.getLatestLedger();
  return ledger.sequence;
}

export async function readIdeaEvents({
  cursor,
  startLedger,
  limit = 100,
}: {
  cursor?: string;
  startLedger?: number;
  limit?: number;
}) {
  const contractId =
    process.env.SOROBAN_CONTRACT_ID ||
    process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID;
  if (!contractId) return { events: [] as IdeaContractEvent[], cursor };

  const server = new rpc.Server(process.env.SOROBAN_RPC_URL || DEFAULT_RPC_URL);
  const response = await server.getEvents({
    ...(cursor
      ? { cursor }
      : { startLedger: startLedger ?? (await latestLedgerSequence()) }),
    filters: [{ type: "contract", contractIds: [contractId] }],
    limit: Math.min(Math.max(limit, 1), 200),
  });
  const events: IdeaContractEvent[] = [];
  let nextCursor = cursor;
  for (const event of response.events) {
    nextCursor = event.pagingToken;
    const normalized = normalizeIdeaEvent({
      eventId: event.pagingToken,
      topics: event.topic.map((topic) => scValToNative(topic)),
      value: scValToNative(event.value),
    });
    if (normalized) events.push(normalized);
  }
  return { events, cursor: nextCursor };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  HelloWorldContract,
  subscribeToIdeaEvents,
} from "@/lib/soroban-contract";

const PAGE_SIZE = 30;

function matchesCurrentFilters(idea, query) {
  const params = new URLSearchParams(query);
  const text = params.get("q")?.toLowerCase();
  const haystack =
    `${idea.title || ""} ${idea.excerpt || ""} ${idea.author || ""} ${(idea.tags || []).join(" ")}`.toLowerCase();
  if (text && !haystack.includes(text)) return false;
  if (params.get("category") && idea.category !== params.get("category"))
    return false;
  const tags = params.get("tags")?.split(",").filter(Boolean) || [];
  if (tags.length && !tags.every((tag) => (idea.tags || []).includes(tag)))
    return false;
  if (params.get("contentType") === "premium" && !idea.premium) return false;
  if (params.get("contentType") === "free" && idea.premium) return false;
  return true;
}

export function reconcileIdeaEvent(current, event) {
  if (event.type === "idea.created") {
    if (current.some((idea) => String(idea.id) === String(event.idea.id)))
      return current;
    return [event.idea, ...current];
  }
  return current.map((idea) => {
    if (String(idea.id) !== String(event.ideaId)) return idea;
    return {
      ...idea,
      votes: event.votes ?? Number(idea.votes || 0) + Number(event.delta || 0),
    };
  });
}

export function useRealtimeIdeas(searchParams) {
  const [ideas, setIdeas] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const seenEvents = useRef(new Set());
  const query = searchParams.toString();

  const loadPage = useCallback(
    async (cursor, signal) => {
      const params = new URLSearchParams(query);
      params.set("limit", String(PAGE_SIZE));
      if (cursor) params.set("cursor", cursor);
      const response = await fetch(`/api/ideas/search?${params}`, { signal });
      if (!response.ok) throw new Error("Ideas are temporarily unavailable.");
      return response.json();
    },
    [query],
  );

  useEffect(() => {
    const controller = new AbortController();
    setIsPending(true);
    setError("");
    loadPage(null, controller.signal)
      .then((payload) => {
        setIdeas(payload.results);
        setNextCursor(payload.nextCursor);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsPending(false);
      });
    return () => controller.abort();
  }, [loadPage]);

  useEffect(
    () =>
      subscribeToIdeaEvents({
        onEvent(event) {
          if (seenEvents.current.has(event.eventId)) return;
          seenEvents.current.add(event.eventId);
          if (seenEvents.current.size > 2_000) {
            seenEvents.current = new Set([...seenEvents.current].slice(-1_000));
          }
          if (
            event.type === "idea.created" &&
            !matchesCurrentFilters(event.idea, query)
          )
            return;
          setIdeas((current) => reconcileIdeaEvent(current, event));
        },
      }),
    [query],
  );

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const payload = await loadPage(nextCursor);
      setIdeas((current) => {
        const ids = new Set(current.map((idea) => String(idea.id)));
        return [
          ...current,
          ...payload.results.filter((idea) => !ids.has(String(idea.id))),
        ];
      });
      setNextCursor(payload.nextCursor);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, loadPage, nextCursor]);

  const vote = useCallback(async (ideaId, direction) => {
    const delta = direction === "up" ? 1 : -1;
    setIdeas((current) =>
      reconcileIdeaEvent(current, {
        eventId: `optimistic-${Date.now()}`,
        type: "idea.voted",
        ideaId: String(ideaId),
        delta,
      }),
    );
    try {
      await HelloWorldContract.voteIdea(
        String(ideaId),
        "connected-wallet",
        direction,
      );
    } catch (voteError) {
      setIdeas((current) =>
        reconcileIdeaEvent(current, {
          eventId: `rollback-${Date.now()}`,
          type: "idea.voted",
          ideaId: String(ideaId),
          delta: -delta,
        }),
      );
      setError(
        voteError instanceof Error
          ? voteError.message
          : "Vote could not be submitted.",
      );
      throw voteError;
    }
  }, []);

  return {
    ideas,
    isPending,
    isLoadingMore,
    error,
    hasMore: Boolean(nextCursor),
    loadMore,
    vote,
  };
}

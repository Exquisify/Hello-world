import { describe, expect, it } from "vitest";

import { normalizeIdeaEvent } from "./idea-events";

describe("normalizeIdeaEvent", () => {
  it("normalizes create_idea contract events", () => {
    expect(
      normalizeIdeaEvent({
        eventId: "100-1",
        topics: ["create_idea"],
        value: { id: 7n, title: "Streaming from Soroban", votes: 0n },
      }),
    ).toEqual({
      eventId: "100-1",
      type: "idea.created",
      idea: {
        id: "7",
        title: "Streaming from Soroban",
        votes: 0,
        excerpt: "",
        author: "Stellar account",
        tags: [],
        premium: false,
        publishedAt: expect.any(String),
      },
    });
  });

  it("normalizes vote_idea contract events", () => {
    expect(
      normalizeIdeaEvent({
        eventId: "100-2",
        topics: ["vote_idea"],
        value: { idea_id: 7n, votes: 11n },
      }),
    ).toEqual({
      eventId: "100-2",
      type: "idea.voted",
      ideaId: "7",
      votes: 11,
      delta: undefined,
    });
  });

  it("ignores unrelated or incomplete contract events", () => {
    expect(
      normalizeIdeaEvent({ eventId: "x", topics: ["comment"], value: {} }),
    ).toBeNull();
    expect(
      normalizeIdeaEvent({ eventId: "y", topics: ["create_idea"], value: {} }),
    ).toBeNull();
  });
});

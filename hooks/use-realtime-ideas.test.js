import { describe, expect, it } from "vitest";

import { reconcileIdeaEvent } from "./use-realtime-ideas";

describe("reconcileIdeaEvent", () => {
  it("prepends new ideas once and reconciles absolute vote counts", () => {
    const initial = [{ id: "1", title: "Existing", votes: 3 }];
    const created = {
      eventId: "10-1",
      type: "idea.created",
      idea: { id: "2", title: "Live idea", votes: 0 },
    };
    const withIdea = reconcileIdeaEvent(initial, created);
    expect(withIdea.map((idea) => idea.id)).toEqual(["2", "1"]);
    expect(reconcileIdeaEvent(withIdea, created)).toHaveLength(2);

    expect(
      reconcileIdeaEvent(withIdea, {
        eventId: "10-2",
        type: "idea.voted",
        ideaId: "2",
        votes: 17,
      })[0].votes,
    ).toBe(17);
  });

  it("applies and reverses optimistic vote deltas", () => {
    const initial = [{ id: "1", title: "Existing", votes: 3 }];
    const optimistic = reconcileIdeaEvent(initial, {
      eventId: "optimistic",
      type: "idea.voted",
      ideaId: "1",
      delta: 1,
    });
    const rolledBack = reconcileIdeaEvent(optimistic, {
      eventId: "rollback",
      type: "idea.voted",
      ideaId: "1",
      delta: -1,
    });
    expect(optimistic[0].votes).toBe(4);
    expect(rolledBack[0].votes).toBe(3);
  });
});

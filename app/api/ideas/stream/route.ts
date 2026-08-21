import { latestLedgerSequence, readIdeaEvents } from "@/lib/idea-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const encoder = new TextEncoder();
const POLL_INTERVAL_MS = 3_000;

function frame(event: { eventId: string }, payload: unknown) {
  return `id: ${event.eventId}\nevent: idea\ndata: ${JSON.stringify(payload)}\n\n`;
}

export async function GET(request: Request) {
  let closed = false;
  let cursor =
    request.headers.get("last-event-id") ||
    new URL(request.url).searchParams.get("cursor") ||
    undefined;
  const startLedger = cursor
    ? undefined
    : await latestLedgerSequence().catch(() => undefined);

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(": connected\n\n"));
      while (!closed) {
        try {
          const batch = await readIdeaEvents({ cursor, startLedger });
          cursor = batch.cursor;
          for (const event of batch.events)
            controller.enqueue(encoder.encode(frame(event, event)));
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          controller.enqueue(
            encoder.encode('event: bridge-error\ndata: {"retryable":true}\n\n'),
          );
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
      controller.close();
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}

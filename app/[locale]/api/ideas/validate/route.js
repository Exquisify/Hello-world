import { NextResponse } from "next/server";

import { validateIdeaDraft } from "@/lib/idea-validation";

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = validateIdeaDraft(payload);

    if (!result.valid) {
      return NextResponse.json(
        { ok: false, errors: result.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      normalized: result.normalized,
      metrics: result.metrics,
      batchPlan: result.batchPlan,
    });
  } catch (error) {
    console.error("Idea validation failed:", error);
    return NextResponse.json(
      {
        ok: false,
        errors: {
          form: ["Unable to validate the idea right now."],
        },
      },
      { status: 500 },
    );
  }
}

import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    // Saki PADC API 呼び出し
    const hfRes = await fetch(
      "https://cheekysorghum-saki-padc-api.hf.space/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      console.error("Saki API Error:", errText);
      return NextResponse.json(
        { error: "Saki PADC API failed", detail: errText },
        { status: 500 }
      );
    }

    const scores = await hfRes.json();
    // scores = { P_Valence, A_Strength, D_Extent, C_Certainty }
    console.log("Saki PADC Response:", scores);

    const entry = {
      id: uuidv4(),
      text,
      scores,
      feedback: null,
      createdAt: new Date().toISOString(),
    };

    await redis.rpush("logs", JSON.stringify(entry));

    return NextResponse.json({ id: entry.id, scores });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", detail: String(err) },
      { status: 500 }
    );
  }
}

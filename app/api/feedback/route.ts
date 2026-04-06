import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  const { id, correct } = await req.json();

  const logs: string[] = await redis.lrange("logs", 0, -1);

  const updated = logs.map((raw) => {
    const entry = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (entry.id === id) {
      entry.feedback = correct; // true = 合ってる / false = 違う
    }
    return JSON.stringify(entry);
  });

  await redis.del("logs");
  if (updated.length > 0) {
    await redis.rpush("logs", ...updated);
  }

  return NextResponse.json({ ok: true });
}

import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  const logs: string[] = await redis.lrange("logs", 0, -1);

  const parsed = logs.map((raw) =>
    typeof raw === "string" ? JSON.parse(raw) : raw
  );

  const total = parsed.length;
  const correct = parsed.filter((e) => e.feedback === true).length;
  const incorrect = parsed.filter((e) => e.feedback === false).length;

  return NextResponse.json({
    logs: parsed,
    stats: { total, correct, incorrect },
  });
}

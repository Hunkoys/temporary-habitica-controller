import { channel } from "@/app/api/stream/route";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // always run dynamically

type callback = (value: number) => void;

export function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {},
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function POST() {
  (async () => {
    for (let hp = 0; hp < 20; hp++) {
      await new Promise((res) => setTimeout(res, 1000));

      channel.emit("bossDamage", {
        hp,
      });
    }
  })();
  return new NextResponse("ok"); // send channel object
}

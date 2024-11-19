import HabiticaServerProcess from "@/app/_processes/habitica";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const partyId = "tanglo";
let session: null | ReadableStreamDefaultController = null;

export const channel = HabiticaServerProcess.channel(partyId);

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    async start(c) {
      controller = c;
      channel.join({
        peerId: "nick",
        send(action, data) {
          try {
            if (action === "bossDamage")
              c.enqueue(encoder.encode((data as { hp: number }).hp.toString()));
          } catch (err) {
            channel.quit("nick");
            c.close();
          }
        },
      });

      c.enqueue(encoder.encode("0"));

      console.log("peer", HabiticaServerProcess.channel(partyId).peers);
      return true;
    },

    cancel() {
      console.log(`canceled ${controller}`);
      controller?.close();
      channel.quit("nick");
    },
  });

  return new NextResponse(stream, {
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}

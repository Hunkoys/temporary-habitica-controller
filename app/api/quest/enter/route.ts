"server-only";

import { getUser } from "@/app/_actions/db";
import { Ampeer } from "@/app/_lib/ampeer/server";
import {
  createPeer,
  isAuthenticated,
  UNAUTHORIZED_RESPONSE,
} from "@/app/_utils/quest/process";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (isAuthenticated() === false) return UNAUTHORIZED_RESPONSE;

  const party: string = (await getUser())?.party || "";

  const [peerId, stream] = await createPeer(party);

  return new NextResponse(stream, {
    headers: { ...Ampeer.headers, peerId },
  });
}

"server-only";

import {
  ampeer,
  isAuthenticated as isAuthorized,
  UNAUTHORIZED_RESPONSE,
} from "@/app/_utils/quest/process";
import { QuestPayload } from "@/app/_utils/quest/types";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HabiticaSkillNames = "flame" | "pickpocket";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  if (isAuthorized() == false) return UNAUTHORIZED_RESPONSE;

  const name = (await params).name;
  const id = headers().get("peer-id");
  console.log(id);
  if (id == null) return new Response(null, { status: 400 });

  const broadcast = ampeer.broadcastChannelOf(id, {
    type: "gameState",
    data: {
      boss: {
        hp: 20,
      },
    },
  } as QuestPayload);

  broadcast.then(console.log);

  return new Response();
}

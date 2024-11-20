"server-only";

import { Ampeer } from "@/app/_lib/ampeer/server";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const ampeer = new Ampeer();

export function isAuthenticated() {
  return auth().userId !== null;
}

export const UNAUTHORIZED_RESPONSE = NextResponse.json(
  {
    success: false,
    error: "Unauthorized",
  },
  {
    status: 401,
  }
);

export async function createPeer(party: string) {
  const id = randomUUID();
  const [spawn, stream] = await ampeer.spawn(id);
  if (spawn !== "succes") throw new Error("Failed to spawn");

  const join = await ampeer.join(id, party);
  if (join !== "success") throw new Error("Failed to join channel");

  return [id, stream] as const;
}

export async function deletePeer(id: string | null) {
  if (!id) throw new Error("id not supplied");
  const despawn = await ampeer.despawn(id);
  if (despawn !== "success") throw new Error("Failed to despawn");
}

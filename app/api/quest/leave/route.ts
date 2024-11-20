"server-only";

import {
  deletePeer,
  isAuthenticated,
  UNAUTHORIZED_RESPONSE,
} from "@/app/_utils/quest/process";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  if (isAuthenticated() === false) return UNAUTHORIZED_RESPONSE;

  const id = req.nextUrl.searchParams.get("id");
  try {
    deletePeer(id);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

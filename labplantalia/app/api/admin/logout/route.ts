import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/server/admin-api";

export async function POST(): Promise<NextResponse> {
  return clearAdminSessionCookie(NextResponse.json({ ok: true }));
}

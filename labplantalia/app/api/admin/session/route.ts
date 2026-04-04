import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/admin/session";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!accessToken) {
    return NextResponse.json(
      { message: "No hay sesión de administración activa." },
      { status: 401 },
    );
  }
  return NextResponse.json({ authenticated: true });
}

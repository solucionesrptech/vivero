import { NextResponse } from "next/server";
import { getPlantaliaApiBaseUrl } from "@/lib/config/plantalia-api";
import { setAdminSessionCookie } from "@/lib/server/admin-api";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request): Promise<NextResponse> {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { message: "Body JSON inválido." },
      { status: 400 },
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json(
      { message: "Correo y contraseña son obligatorios." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${getPlantaliaApiBaseUrl()}/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    const payload = (await response.json()) as
      | { accessToken?: string; message?: string | string[] }
      | string[];
    const accessToken =
      !Array.isArray(payload) &&
      payload &&
      typeof payload === "object" &&
      typeof payload.accessToken === "string"
        ? payload.accessToken
        : null;

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }
    if (!accessToken) {
      return NextResponse.json(
        { message: "Respuesta inválida del backend de autenticación." },
        { status: 502 },
      );
    }

    const success = NextResponse.json({ ok: true });
    return setAdminSessionCookie(success, accessToken);
  } catch {
    return NextResponse.json(
      { message: "No se pudo contactar el backend de autenticación." },
      { status: 503 },
    );
  }
}

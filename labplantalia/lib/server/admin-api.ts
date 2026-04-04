import { NextRequest, NextResponse } from "next/server";
import { getPlantaliaApiBaseUrl } from "@/lib/config/plantalia-api";
import {
  ADMIN_SESSION_COOKIE_NAME,
  buildAdminSessionCookieOptions,
} from "@/lib/admin/session";

type ProxyAdminApiOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
};

export function clearAdminSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    ...buildAdminSessionCookieOptions(),
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    maxAge: 0,
  });
  return response;
}

export function setAdminSessionCookie(
  response: NextResponse,
  accessToken: string,
): NextResponse {
  response.cookies.set({
    ...buildAdminSessionCookieOptions(),
    name: ADMIN_SESSION_COOKIE_NAME,
    value: accessToken,
  });
  return response;
}

function buildUnauthorizedResponse(message: string): NextResponse {
  return clearAdminSessionCookie(
    NextResponse.json({ message }, { status: 401 }),
  );
}

export async function proxyAdminApi(
  request: NextRequest,
  path: string,
  options: ProxyAdminApiOptions = {},
): Promise<NextResponse> {
  const accessToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!accessToken) {
    return buildUnauthorizedResponse("No hay sesión de administración activa.");
  }

  const headers = new Headers({
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${getPlantaliaApiBaseUrl()}${path}`, {
      method: options.method ?? "GET",
      headers,
      cache: "no-store",
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();
    const proxied = isJson
      ? NextResponse.json(payload, { status: response.status })
      : new NextResponse(String(payload), {
          status: response.status,
          headers: contentType
            ? { "Content-Type": contentType }
            : undefined,
        });

    if (response.status === 401) {
      return clearAdminSessionCookie(proxied);
    }
    return proxied;
  } catch {
    return NextResponse.json(
      { message: "No se pudo contactar el backend de administración." },
      { status: 503 },
    );
  }
}

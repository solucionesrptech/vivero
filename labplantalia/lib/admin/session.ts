export const ADMIN_SESSION_COOKIE_NAME = "plantalia-admin-session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export function buildAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

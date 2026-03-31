import { getPlantaliaApiBaseUrl } from "@/lib/config/plantalia-api";
import type { TopProductSold } from "@/lib/types/analytics-api";

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data: unknown = await res.json();
    if (data && typeof data === "object" && "message" in data) {
      const m = (data as { message: unknown }).message;
      if (typeof m === "string") return m;
      if (Array.isArray(m)) return m.filter((x) => typeof x === "string").join(", ");
    }
  } catch {
    /* ignore */
  }
  return "Error al contactar el servidor.";
}

function adminHeaders(token: string): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchTopProductsSold(token: string): Promise<TopProductSold[]> {
  const res = await fetch(`${getPlantaliaApiBaseUrl()}/analytics/top-products`, {
    method: "GET",
    headers: adminHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<TopProductSold[]>;
}

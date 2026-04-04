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

export async function fetchTopProductsSold(): Promise<TopProductSold[]> {
  const res = await fetch("/api/admin/analytics/top-products", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<TopProductSold[]>;
}

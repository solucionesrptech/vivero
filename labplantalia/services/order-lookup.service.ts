import { getPlantaliaApiBaseUrl } from "@/lib/config/plantalia-api";
import type { OrderLookupResult } from "@/lib/types/order-lookup-api";

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data: unknown = await res.json();
    if (data && typeof data === "object" && "message" in data) {
      const m = (data as { message: unknown }).message;
      if (typeof m === "string") return m;
    }
  } catch {
    /* ignore */
  }
  return "No se pudo consultar el pedido.";
}

export async function fetchOrderLookup(
  publicCode: string,
  phone: string,
): Promise<OrderLookupResult> {
  const q = new URLSearchParams({ publicCode: publicCode.trim(), phone: phone.trim() });
  const res = await fetch(
    `${getPlantaliaApiBaseUrl()}/orders/lookup?${q.toString()}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<OrderLookupResult>;
}

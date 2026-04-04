import { getPlantaliaApiBaseUrl } from "@/lib/config/plantalia-api";
import type { AdminOrderDetail, AdminOrderListRow } from "@/lib/types/admin-orders-api";

function adminHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

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
  return "No se pudo completar la operación.";
}

const base = () => getPlantaliaApiBaseUrl();

export async function fetchAdminOrders(token: string): Promise<AdminOrderListRow[]> {
  const res = await fetch(`${base()}/admin/orders`, {
    cache: "no-store",
    headers: adminHeaders(token),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminOrderListRow[]>;
}

export async function fetchAdminOrderDetail(
  token: string,
  orderId: string,
): Promise<AdminOrderDetail> {
  const res = await fetch(
    `${base()}/admin/orders/${encodeURIComponent(orderId)}`,
    {
      cache: "no-store",
      headers: adminHeaders(token),
    },
  );
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminOrderDetail>;
}

export async function patchAdminOrderStatus(
  token: string,
  orderId: string,
  status: string,
): Promise<AdminOrderDetail> {
  const res = await fetch(
    `${base()}/admin/orders/${encodeURIComponent(orderId)}/status`,
    {
      method: "PATCH",
      headers: adminHeaders(token),
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminOrderDetail>;
}

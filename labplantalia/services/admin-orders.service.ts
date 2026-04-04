import type { AdminOrderDetail, AdminOrderListRow } from "@/lib/types/admin-orders-api";

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
export async function fetchAdminOrders(): Promise<AdminOrderListRow[]> {
  const res = await fetch("/api/admin/orders", {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminOrderListRow[]>;
}

export async function fetchAdminOrderDetail(
  orderId: string,
): Promise<AdminOrderDetail> {
  const res = await fetch(
    `/api/admin/orders/${encodeURIComponent(orderId)}`,
    {
      cache: "no-store",
      headers: { Accept: "application/json" },
    },
  );
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminOrderDetail>;
}

export async function patchAdminOrderStatus(
  orderId: string,
  status: string,
): Promise<AdminOrderDetail> {
  const res = await fetch(
    `/api/admin/orders/${encodeURIComponent(orderId)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminOrderDetail>;
}

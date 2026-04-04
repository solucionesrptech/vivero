import { getPlantaliaApiBaseUrl } from "@/lib/config/plantalia-api";
import type {
  AdminProductCreated,
  AdminProductRow,
  CreateAdminProductPayload,
} from "@/lib/types/admin-api";

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

export async function fetchAdminProducts(token: string): Promise<AdminProductRow[]> {
  const res = await fetch(`${getPlantaliaApiBaseUrl()}/admin/products`, {
    method: "GET",
    headers: adminHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminProductRow[]>;
}

export async function patchAdminProductStock(
  token: string,
  productId: string,
  delta: number,
): Promise<AdminProductRow> {
  const res = await fetch(
    `${getPlantaliaApiBaseUrl()}/admin/products/${encodeURIComponent(productId)}/stock`,
    {
      method: "PATCH",
      headers: {
        ...adminHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ delta }),
    },
  );
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminProductRow>;
}

export async function postAdminProduct(
  token: string,
  body: CreateAdminProductPayload,
): Promise<AdminProductCreated> {
  const res = await fetch(`${getPlantaliaApiBaseUrl()}/admin/products`, {
    method: "POST",
    headers: {
      ...adminHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminProductCreated>;
}

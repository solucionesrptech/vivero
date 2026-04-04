import type {
  AdminProductCreated,
  AdminProductRow,
  CreateAdminProductPayload,
} from "@/lib/types/admin-api";

function normalizeAdminProductError(message: string): string {
  if (message === "Producto no encontrado") {
    return "El producto ya no existe o cambió de identificador. Recarga el listado e inténtalo de nuevo.";
  }
  return message;
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data: unknown = await res.json();
    if (data && typeof data === "object" && "message" in data) {
      const m = (data as { message: unknown }).message;
      if (typeof m === "string") return normalizeAdminProductError(m);
      if (Array.isArray(m)) {
        return normalizeAdminProductError(
          m.filter((x) => typeof x === "string").join(", "),
        );
      }
    }
  } catch {
    /* ignore */
  }
  return "Error al contactar el servidor.";
}

export async function fetchAdminProducts(): Promise<AdminProductRow[]> {
  const res = await fetch("/api/admin/products", {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminProductRow[]>;
}

export async function patchAdminProductStock(
  productId: string,
  delta: number,
): Promise<AdminProductRow> {
  const res = await fetch(
    `/api/admin/products/${encodeURIComponent(productId)}/stock`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
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
  body: CreateAdminProductPayload,
): Promise<AdminProductCreated> {
  const res = await fetch("/api/admin/products", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<AdminProductCreated>;
}

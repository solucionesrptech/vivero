import { getPlantaliaApiBaseUrl } from "@/lib/config/plantalia-api";
import type { CartApi } from "@/lib/types/cart-api";

const STORAGE_KEY = "plantalia-cart-id";

export function readStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function writeStoredCartId(cartId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, cartId);
}

export function clearStoredCartId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
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

function cartUrl(path: string): string {
  return `${getPlantaliaApiBaseUrl()}${path}`;
}

/** Evita rechazos silenciosos de red/CORS con mensaje usable en UI. */
async function cartFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el servidor del carrito. Comprueba que el API esté en marcha (puerto 3101) y que puedas abrir el sitio desde localhost o la misma red que permite CORS.",
      );
    }
    throw e;
  }
}

export async function addCartItem(
  productId: string,
  quantity: number,
  cartId?: string | null,
): Promise<CartApi> {
  const body: { productId: string; quantity: number; cartId?: string } = {
    productId,
    quantity,
  };
  if (cartId) body.cartId = cartId;

  const res = await cartFetch(cartUrl("/cart/items"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<CartApi>;
}

export async function fetchCart(cartId: string): Promise<CartApi> {
  const res = await cartFetch(cartUrl(`/cart/${cartId}`), {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      clearStoredCartId();
    }
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<CartApi>;
}

export async function patchCartItemQuantity(
  cartId: string,
  itemId: string,
  quantity: number,
): Promise<CartApi> {
  const q = new URLSearchParams({ cartId });
  const res = await cartFetch(cartUrl(`/cart/items/${itemId}?${q.toString()}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<CartApi>;
}

/** Checkout V1: descuenta stock en el servidor y devuelve el carrito vacío. */
export async function postCheckoutCart(cartId: string): Promise<CartApi> {
  const res = await cartFetch(cartUrl("/cart/checkout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId }),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<CartApi>;
}

export async function deleteCartItem(
  cartId: string,
  itemId: string,
): Promise<CartApi> {
  const q = new URLSearchParams({ cartId });
  const res = await cartFetch(cartUrl(`/cart/items/${itemId}?${q.toString()}`), {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json() as Promise<CartApi>;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  CartDrawer,
  type CartCheckoutPayload,
} from "@/components/cart/CartDrawer";
import type { CartApi, CartItemApi } from "@/lib/types/cart-api";
import type { CheckoutOrderApi } from "@/lib/types/checkout-api";
import {
  addCartItem,
  clearStoredCartId,
  deleteCartItem,
  fetchCart,
  patchCartItemQuantity,
  postCheckoutCart,
  readStoredCartId,
  writeStoredCartId,
} from "@/services/cart.service";

type CartContextValue = {
  cart: CartApi | null;
  cartId: string | null;
  error: string | null;
  isHydrated: boolean;
  isSyncing: boolean;
  drawerOpen: boolean;
  itemCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  increaseLine: (item: CartItemApi) => Promise<void>;
  decreaseLine: (item: CartItemApi) => Promise<void>;
  removeLine: (item: CartItemApi) => Promise<void>;
  /** Checkout en API: devuelve la orden creada y deja el carrito vacío. */
  checkout: (payload: CartCheckoutPayload) => Promise<CheckoutOrderApi>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartApi | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    const id = readStoredCartId();
    if (!id) {
      setCart(null);
      setCartId(null);
      return;
    }
    setIsSyncing(true);
    setError(null);
    try {
      const next = await fetchCart(id);
      setCart(next);
      setCartId(next.id);
      writeStoredCartId(next.id);
    } catch (e) {
      setCart(null);
      setCartId(null);
      clearStoredCartId();
      setError(e instanceof Error ? e.message : "Error al cargar el carrito");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const stored = readStoredCartId();
    setCartId(stored);
    setIsHydrated(true);
    if (!stored) return;
    void (async () => {
      setIsSyncing(true);
      setError(null);
      try {
        const next = await fetchCart(stored);
        setCart(next);
        setCartId(next.id);
        writeStoredCartId(next.id);
      } catch (e) {
        setCart(null);
        setCartId(null);
        clearStoredCartId();
        setError(e instanceof Error ? e.message : "Error al cargar el carrito");
      } finally {
        setIsSyncing(false);
      }
    })();
  }, []);

  const addItem = useCallback(async (productId: string, quantity: number) => {
    setIsSyncing(true);
    setError(null);
    try {
      const id = readStoredCartId();
      const next = await addCartItem(productId, quantity, id);
      setCart(next);
      setCartId(next.id);
      writeStoredCartId(next.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo agregar al carrito");
      throw e;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const runLineMutation = useCallback(
    async (itemId: string, fn: () => Promise<CartApi>) => {
      const id = readStoredCartId();
      if (!id) {
        setError("No hay carrito activo");
        return;
      }
      setBusyItemId(itemId);
      setError(null);
      try {
        const next = await fn();
        setCart(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al actualizar el carrito");
      } finally {
        setBusyItemId(null);
      }
    },
    [],
  );

  const increaseLine = useCallback(
    async (item: CartItemApi) => {
      const id = readStoredCartId();
      if (!id) return;
      if (typeof item.stock === "number" && item.quantity >= item.stock) {
        return;
      }
      await runLineMutation(item.id, () =>
        patchCartItemQuantity(id, item.id, item.quantity + 1),
      );
    },
    [runLineMutation],
  );

  const decreaseLine = useCallback(
    async (item: CartItemApi) => {
      const id = readStoredCartId();
      if (!id) return;
      if (item.quantity <= 1) {
        await runLineMutation(item.id, () => deleteCartItem(id, item.id));
        return;
      }
      await runLineMutation(item.id, () =>
        patchCartItemQuantity(id, item.id, item.quantity - 1),
      );
    },
    [runLineMutation],
  );

  const removeLine = useCallback(
    async (item: CartItemApi) => {
      const id = readStoredCartId();
      if (!id) return;
      await runLineMutation(item.id, () => deleteCartItem(id, item.id));
    },
    [runLineMutation],
  );

  const checkout = useCallback(
    async (payload: CartCheckoutPayload) => {
      const id = readStoredCartId();
      if (!id) {
        setError("No hay carrito activo");
        throw new Error("No hay carrito activo");
      }
      setIsSyncing(true);
      setError(null);
      try {
        const res = await postCheckoutCart({
          cartId: id,
          deliveryType: payload.deliveryType,
          customerName: payload.customerName,
          customerPhone: payload.customerPhone,
          deliveryAddress: payload.deliveryAddress,
        });
        setCart(res.cart);
        setCartId(res.cart.id);
        writeStoredCartId(res.cart.id);
        router.refresh();
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("plantalia-last-order-code", res.order.publicCode);
        }
        return res.order;
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "No se pudo completar el pago",
        );
        throw e;
      } finally {
        setIsSyncing(false);
      }
    },
    [router],
  );

  const itemCount = useMemo(
    () => cart?.items.reduce((acc, i) => acc + i.quantity, 0) ?? 0,
    [cart],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      cartId,
      error,
      isHydrated,
      isSyncing,
      drawerOpen,
      itemCount,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => {
        setDrawerOpen(false);
        setError(null);
      },
      refreshCart,
      addItem,
      increaseLine,
      decreaseLine,
      removeLine,
      checkout,
    }),
    [
      cart,
      cartId,
      error,
      isHydrated,
      isSyncing,
      drawerOpen,
      itemCount,
      refreshCart,
      addItem,
      increaseLine,
      decreaseLine,
      removeLine,
      checkout,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={cart?.items ?? []}
        total={cart?.total ?? 0}
        busyItemId={busyItemId}
        isSyncing={isSyncing}
        error={drawerOpen ? error : null}
        onIncrease={increaseLine}
        onDecrease={decreaseLine}
        onRemove={removeLine}
        onCheckout={checkout}
      />
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}

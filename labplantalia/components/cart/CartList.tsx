import { formatClp } from "@/lib/format/clp";
import type { CartItemApi } from "@/lib/types/cart-api";

export type CartListProps = {
  items: CartItemApi[];
  total: number;
  busyItemId: string | null;
  onIncrease: (item: CartItemApi) => void;
  onDecrease: (item: CartItemApi) => void;
  onRemove: (item: CartItemApi) => void;
};

export function CartList({
  items,
  total,
  busyItemId,
  onIncrease,
  onDecrease,
  onRemove,
}: CartListProps) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-muted">
        Tu carrito está vacío
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <ul className="flex flex-col gap-4">
        {items.map((item) => {
          const busy = busyItemId === item.id;
          const stock = item.stock;
          const canAddMore =
            typeof stock === "number" ? Math.max(stock - item.quantity, 0) : 0;
          const atMax = typeof stock === "number" && canAddMore === 0;
          return (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-background/60 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted">
                    {formatClp(item.unitPrice)} c/u
                  </p>
                  {typeof stock === "number" ? (
                    <div className="mt-1 space-y-0.5 text-xs text-muted">
                      <p>
                        Stock actual:{" "}
                        <span className="font-semibold tabular-nums text-foreground">
                          {stock}
                        </span>
                      </p>
                      <p>
                        En tu carrito:{" "}
                        <span className="font-semibold tabular-nums text-foreground">
                          {item.quantity}
                        </span>
                      </p>
                      <p>
                        Puedes agregar:{" "}
                        <span className="font-semibold tabular-nums text-foreground">
                          {canAddMore}
                        </span>{" "}
                        más
                      </p>
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onRemove(item)}
                  className="shrink-0 rounded-full px-2 py-1 text-xs text-muted underline-offset-2 transition-colors hover:text-primary hover:underline disabled:opacity-50"
                >
                  Quitar
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 rounded-full border border-border-subtle bg-surface p-0.5">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onDecrease(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-primary transition-colors hover:bg-background disabled:opacity-50"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={busy || atMax}
                    onClick={() => onIncrease(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-primary transition-colors hover:bg-background disabled:opacity-50"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-semibold text-primary tabular-nums">
                  {formatClp(item.lineSubtotal)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-border-subtle pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-display text-lg text-primary tabular-nums">
            {formatClp(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import type { CatalogProduct } from "@/lib/types/catalog-product";
import type { CartLineDraft } from "@/lib/types/cart-selection";
import { CatalogProductCard } from "@/components/catalog/CatalogProductCard";
import { useCart } from "@/context/cart.context";

type CategoriaCatalogClientProps = {
  products: CatalogProduct[];
};

export function CategoriaCatalogClient({ products }: CategoriaCatalogClientProps) {
  const { addItem } = useCart();

  function handleAddToCart(draft: CartLineDraft) {
    return addItem(draft.product.id, draft.quantity);
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {products.map((product) => (
        <li key={product.id} className="h-full">
          <CatalogProductCard product={product} onAddToCart={handleAddToCart} />
        </li>
      ))}
    </ul>
  );
}

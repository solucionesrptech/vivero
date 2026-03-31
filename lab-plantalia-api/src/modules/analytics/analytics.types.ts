/** Fila agregada lista para exponer al cliente (sin lógica en controller). */
export type TopProductSoldRow = {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
};

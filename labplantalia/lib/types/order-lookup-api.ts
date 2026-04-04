export type OrderLookupItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
};

export type OrderLookupResult = {
  publicCode: string;
  status: string;
  total: number;
  deliveryType: string;
  deliveryAddress: string | null;
  items: OrderLookupItem[];
};

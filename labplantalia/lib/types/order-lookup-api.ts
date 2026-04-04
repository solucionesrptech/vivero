export type OrderLookupItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
};

export type OrderLookupResult = {
  id: string;
  publicCode: string;
  createdAt: string;
  status: string;
  total: number;
  deliveryType: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  items: OrderLookupItem[];
};

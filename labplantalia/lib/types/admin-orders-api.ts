export type AdminOrderListLine = {
  productName: string;
  quantity: number;
};

export type AdminOrderListRow = {
  id: string;
  publicCode: string;
  createdAt: string;
  status: string;
  total: number;
  deliveryType: string;
  customerName: string;
  customerPhone: string;
  /** Presente en API actual; opcional por compatibilidad con respuestas antiguas. */
  items?: AdminOrderListLine[];
};

export type AdminOrderItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
};

export type AdminOrderDetail = {
  id: string;
  publicCode: string;
  createdAt: string;
  status: string;
  total: number;
  deliveryType: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  items: AdminOrderItem[];
  allowedNextStatuses: string[];
};

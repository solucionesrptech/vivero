export type AdminLoginResponse = {
  accessToken: string;
};

export type AdminProductRow = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  stock: number;
};

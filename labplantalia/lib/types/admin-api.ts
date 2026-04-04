export type AdminLoginResponse = {
  accessToken: string;
};

export type AdminProductRow = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  stock: number;
  isActive: boolean;
};

/** Body de POST /admin/products (CreateAdminProductDto). */
export type CreateAdminProductPayload = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  isActive?: boolean;
};

/** Respuesta 201 (AdminProductCreatedDto). */
export type AdminProductCreated = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  stock: number;
  imageSrc: string;
  imageAlt: string;
  isActive: boolean;
};

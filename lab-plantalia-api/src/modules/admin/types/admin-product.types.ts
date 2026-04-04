export type AdminProductListRow = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  stock: number;
  isActive: boolean;
};

export type AdminProductCreatedRow = {
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

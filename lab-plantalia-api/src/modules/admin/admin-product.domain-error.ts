export type AdminProductDomainErrorCode =
  | 'PRODUCT_NOT_FOUND'
  | 'INVALID_CATEGORY_SLUG'
  | 'DUPLICATE_SLUG';

export class AdminProductDomainError extends Error {
  constructor(
    public readonly code: AdminProductDomainErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AdminProductDomainError';
  }
}

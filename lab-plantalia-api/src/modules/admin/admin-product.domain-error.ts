export class AdminProductDomainError extends Error {
  constructor(
    public readonly code: 'PRODUCT_NOT_FOUND',
    message: string,
  ) {
    super(message);
    this.name = 'AdminProductDomainError';
  }
}

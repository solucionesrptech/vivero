export type AdminOrderDomainErrorCode =
  | 'ORDER_NOT_FOUND'
  | 'INVALID_STATUS_TRANSITION';

export class AdminOrderDomainError extends Error {
  constructor(
    public readonly code: AdminOrderDomainErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AdminOrderDomainError';
  }
}

export class AdminAuthDomainError extends Error {
  constructor(
    public readonly code: 'INVALID_CREDENTIALS',
    message: string,
  ) {
    super(message);
    this.name = 'AdminAuthDomainError';
  }
}

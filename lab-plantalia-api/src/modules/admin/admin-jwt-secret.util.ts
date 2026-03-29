/**
 * Secreto JWT admin: en producción obligatorio (ADMIN_JWT_SECRET, ≥8 caracteres).
 * En desarrollo/demo, si falta, se usa un valor fijo local para evitar 500 silenciosos.
 */
export function resolveAdminJwtSecret(): string {
  const fromEnv = process.env.ADMIN_JWT_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 8) {
    return fromEnv;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'ADMIN_JWT_SECRET no está definido o es demasiado corto (mínimo 8 caracteres).',
    );
  }
  return 'plantalia-local-demo-jwt-secret-no-usar-en-produccion-min-48-chars';
}

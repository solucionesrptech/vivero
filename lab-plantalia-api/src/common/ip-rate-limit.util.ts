import type { Request } from 'express';

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

/**
 * Rate limit liviano por proceso.
 * No comparte estado entre instancias; para escalado horizontal conviene moverlo
 * a infraestructura o a un store centralizado.
 */
function shouldTrustProxyHeaders(): boolean {
  return process.env.RATE_LIMIT_TRUST_PROXY?.trim() === 'true';
}

function readForwardedIp(req: Request): string | null {
  if (!shouldTrustProxyHeaders()) {
    return null;
  }
  const header = req.headers['x-forwarded-for'];
  const raw = Array.isArray(header) ? header[0] : header;
  const first = raw?.split(',')[0]?.trim();
  return first && first.length > 0 ? first : null;
}

export function resolveClientIp(req: Request): string {
  return (
    readForwardedIp(req) ??
    req.ip ??
    req.socket.remoteAddress ??
    'unknown-ip'
  );
}

function pruneExpiredBuckets(now: number): void {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function consumeIpRateLimit(
  req: Request,
  namespace: string,
  maxHits: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  pruneExpiredBuckets(now);

  const key = `${namespace}:${resolveClientIp(req)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= maxHits) {
    return false;
  }

  bucket.count += 1;
  return true;
}

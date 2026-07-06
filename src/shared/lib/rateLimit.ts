interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitConfig {
  max: number;
  windowMs: number;
  now?: () => number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

export const checkRateLimit = (key: string, config: RateLimitConfig): RateLimitResult => {
  const now = config.now?.() ?? Date.now();

  for (const [bucketKey, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(bucketKey);
    }
  }

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + config.windowMs };
    buckets.set(key, next);
    return {
      allowed: true,
      remaining: config.max - 1,
      resetAt: next.resetAt,
    };
  }

  if (current.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: config.max - current.count,
    resetAt: current.resetAt,
  };
};

export const clearRateLimitBuckets = () => {
  buckets.clear();
};

import { Redis } from '@upstash/redis';

const PLAN_LIMITS = {
  free:       { daily: 100,      perSec: 5   },
  basic:      { daily: 10000,    perSec: 20  },
  pro:        { daily: 100000,   perSec: 100 },
  enterprise: { daily: 99999999, perSec: 999 },
} as const;

type Plan = keyof typeof PLAN_LIMITS;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp
  reason?: 'daily_limit' | 'rate_limit';
}

function getRedis(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  });
}

/**
 * APIキーのレート制限を確認する。
 * 1秒ウィンドウ（perSec）と日次上限（daily）の両方をチェックする。
 * Upstash Redis の INCR + EXPIRE で実装。
 */
export async function checkRateLimit(apiKeyId: string, plan: Plan): Promise<RateLimitResult> {
  const limits = PLAN_LIMITS[plan];
  const now = Date.now();
  const dayKey = `daily:${apiKeyId}:${new Date().toISOString().slice(0, 10)}`;
  const secKey = `sec:${apiKeyId}:${Math.floor(now / 1000)}`;

  const redis = getRedis();

  const [dailyCount, secCount] = await redis.pipeline()
    .incr(dayKey)
    .incr(secKey)
    .exec<[number, number]>();

  // 初回アクセス時にTTLを設定
  if (dailyCount === 1) await redis.expire(dayKey, 86400);
  if (secCount === 1) await redis.expire(secKey, 2);

  if (secCount > limits.perSec) {
    return { allowed: false, remaining: 0, resetAt: Math.floor(now / 1000) + 1, reason: 'rate_limit' };
  }
  if (dailyCount > limits.daily) {
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    return { allowed: false, remaining: 0, resetAt: Math.floor(tomorrow.getTime() / 1000), reason: 'daily_limit' };
  }

  return { allowed: true, remaining: limits.daily - dailyCount, resetAt: Math.floor(now / 1000) + 1 };
}

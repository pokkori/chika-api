import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';

/**
 * Upstash Redis クライアント
 * 環境変数が未設定の場合は空文字列を渡すが、実際のAPIコールは失敗する。
 * テスト環境ではjest.mockでモックする。
 */
export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

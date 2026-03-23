import { checkRateLimit } from '@/lib/rateLimit';

// Upstash Redisをモック
jest.mock('@upstash/redis', () => {
  const mockPipeline = {
    incr: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([1, 1]),
  };
  return {
    Redis: jest.fn().mockImplementation(() => ({
      pipeline: jest.fn().mockReturnValue(mockPipeline),
      expire: jest.fn().mockResolvedValue(1),
    })),
  };
});

describe('checkRateLimit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // デフォルト: dailyCount=1, secCount=1（初回アクセス）
    const { Redis } = require('@upstash/redis');
    Redis.mockImplementation(() => ({
      pipeline: () => ({
        incr: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([1, 1]),
      }),
      expire: jest.fn().mockResolvedValue(1),
    }));
  });

  it('freeプランは100req/日の制限を持つ', async () => {
    const result = await checkRateLimit('test-key-id', 'free');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(99); // 100 - 1
    expect(typeof result.resetAt).toBe('number');
  });

  it('basicプランは10000req/日の制限を持つ', async () => {
    const result = await checkRateLimit('test-key-id', 'basic');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9999); // 10000 - 1
  });

  it('日次上限超過でallowed: falseかつreason: daily_limitが返る', async () => {
    const { Redis } = require('@upstash/redis');
    Redis.mockImplementation(() => ({
      pipeline: () => ({
        incr: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([101, 1]),
      }),
      expire: jest.fn().mockResolvedValue(1),
    }));
    const result = await checkRateLimit('test-key-id', 'free');
    expect(result.allowed).toBe(false);
    expect((result as { reason?: string }).reason).toBe('daily_limit');
    expect(result.remaining).toBe(0);
  });

  it('毎秒制限超過でallowed: falseかつreason: rate_limitが返る', async () => {
    const { Redis } = require('@upstash/redis');
    Redis.mockImplementation(() => ({
      pipeline: () => ({
        incr: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([1, 6]), // secCount=6 > perSec=5
      }),
      expire: jest.fn().mockResolvedValue(1),
    }));
    const result = await checkRateLimit('test-key-id', 'free');
    expect(result.allowed).toBe(false);
    expect((result as { reason?: string }).reason).toBe('rate_limit');
  });

  it('resetAtはUnix timestamp（数値）である', async () => {
    const result = await checkRateLimit('test-key-id', 'pro');
    expect(result.resetAt).toBeGreaterThan(0);
    expect(Number.isInteger(result.resetAt)).toBe(true);
  });
});

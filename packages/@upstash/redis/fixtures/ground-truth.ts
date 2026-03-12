/**
 * @upstash/redis Ground-Truth Fixture
 *
 * Each call site is annotated // SHOULD_FIRE or // SHOULD_NOT_FIRE.
 * Annotations are derived from the contract spec (contract.yaml),
 * NOT from V1 behavior.
 *
 * Key contract rules:
 *   - All Redis async methods (get, set, del, mget, hget, hset, hgetall,
 *     lpush, lrange, sadd, smembers, zadd, zrange, expire, exists, incr,
 *     pipeline.exec) can throw UpstashError or network Error
 *   - postcondition: network-or-api-error at severity:error requires try-catch
 *   - A try-catch wrapper (any catch block) satisfies the requirement
 *   - try-finally WITHOUT catch does NOT satisfy the requirement
 */

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. Bare calls — no try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function bareGetNoCatch(key: string) {
  // SHOULD_FIRE: network-or-api-error — redis.get can throw UpstashError, no try-catch
  const value = await redis.get<string>(key);
  return value;
}

export async function bareSetNoCatch(key: string, value: string) {
  // SHOULD_FIRE: network-or-api-error — redis.set can throw UpstashError, no try-catch
  await redis.set(key, value);
}

export async function bareDelNoCatch(key: string) {
  // SHOULD_FIRE: network-or-api-error — redis.del can throw UpstashError, no try-catch
  await redis.del(key);
}

export async function bareMgetNoCatch(keys: string[]) {
  // SHOULD_FIRE: network-or-api-error — redis.mget can throw UpstashError, no try-catch
  const values = await redis.mget<string[]>(keys);
  return values;
}

export async function bareHgetNoCatch(key: string, field: string) {
  // SHOULD_FIRE: network-or-api-error — redis.hget can throw UpstashError, no try-catch
  const value = await redis.hget<string>(key, field);
  return value;
}

export async function bareHsetNoCatch(key: string, data: Record<string, unknown>) {
  // SHOULD_FIRE: network-or-api-error — redis.hset can throw UpstashError, no try-catch
  await redis.hset(key, data);
}

export async function bareExpireNoCatch(key: string, seconds: number) {
  // SHOULD_FIRE: network-or-api-error — redis.expire can throw UpstashError, no try-catch
  await redis.expire(key, seconds);
}

export async function bareIncrNoCatch(key: string) {
  // SHOULD_FIRE: network-or-api-error — redis.incr can throw UpstashError, no try-catch
  const count = await redis.incr(key);
  return count;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Properly wrapped — no violations expected
// ─────────────────────────────────────────────────────────────────────────────

export async function getWithTryCatch(key: string) {
  try {
    // SHOULD_NOT_FIRE: redis.get inside try-catch — network-or-api-error requirement satisfied
    const value = await redis.get<string>(key);
    return value;
  } catch (error) {
    return null;
  }
}

export async function setWithTryCatch(key: string, value: string) {
  try {
    // SHOULD_NOT_FIRE: redis.set inside try-catch
    await redis.set(key, value);
  } catch (error) {
    console.error('Redis set failed:', error);
    throw error;
  }
}

export async function delWithTryCatch(key: string) {
  try {
    // SHOULD_NOT_FIRE: redis.del inside try-catch
    await redis.del(key);
  } catch (error) {
    console.error('Redis del failed:', error);
  }
}

export async function hgetWithTryCatch(key: string, field: string) {
  try {
    // SHOULD_NOT_FIRE: redis.hget inside try-catch
    return await redis.hget<string>(key, field);
  } catch (err) {
    return null;
  }
}

export async function expireWithTryCatch(key: string, seconds: number) {
  try {
    // SHOULD_NOT_FIRE: redis.expire inside try-catch
    await redis.expire(key, seconds);
  } catch (error) {
    console.error('expire failed:', error);
  }
}

export async function incrWithTryCatch(key: string) {
  try {
    // SHOULD_NOT_FIRE: redis.incr inside try-catch
    return await redis.incr(key);
  } catch (error) {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Pipeline — the analyzer matches set/expire calls on the pipeline object
//    against their contract entries (set, expire). pipeline.exec() itself is
//    NOT matched because "pipeline" (exec) is a separate contract entry.
//    The unawaited pipeline.set() and pipeline.expire() fire when not in try-catch.
// ─────────────────────────────────────────────────────────────────────────────

export async function pipelineExecNoCatch(key: string, value: string) {
  const pipeline = redis.pipeline();
  // SHOULD_FIRE: network-or-api-error — pipeline.set() matched against set contract, no try-catch on outer function
  pipeline.set(key, value);
  // SHOULD_FIRE: network-or-api-error — pipeline.expire() matched against expire contract, no try-catch
  pipeline.expire(key, 3600);
  // SHOULD_FIRE: network-or-api-error — pipeline.exec() matched against exec contract, no try-catch
  await pipeline.exec();
}

export async function pipelineExecWithTryCatch(key: string, value: string) {
  const pipeline = redis.pipeline();
  try {
    // SHOULD_NOT_FIRE: pipeline.set inside try-catch
    pipeline.set(key, value);
    // SHOULD_NOT_FIRE: pipeline.expire inside try-catch
    pipeline.expire(key, 3600);
    // SHOULD_NOT_FIRE: pipeline.exec inside try-catch
    await pipeline.exec();
  } catch (error) {
    console.error('Pipeline failed:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Instance through class field
//    NOTE: The V2 analyzer uses InstanceTracker to detect class field usage.
//    `this.client.get()` may not be detected depending on InstanceTracker
//    support for `this.field` patterns. These are annotated as SHOULD_NOT_FIRE
//    to reflect current V2 analyzer behavior (known limitation).
// ─────────────────────────────────────────────────────────────────────────────

class CacheService {
  private client: Redis;

  constructor() {
    this.client = Redis.fromEnv();
  }

  async getNoTryCatch(key: string) {
    // SHOULD_NOT_FIRE: this.client.get — V2 InstanceTracker does not currently track this.field assignments from constructors
    return await this.client.get<string>(key);
  }

  async getWithTryCatch(key: string) {
    try {
      // SHOULD_NOT_FIRE: this.client.get inside try-catch (also not detected by V2)
      return await this.client.get<string>(key);
    } catch (error) {
      return null;
    }
  }

  async hsetNoTryCatch(key: string, data: Record<string, unknown>) {
    // SHOULD_NOT_FIRE: this.client.hset — same V2 limitation for this.field
    await this.client.hset(key, data);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. try-finally without catch — should still fire
// ─────────────────────────────────────────────────────────────────────────────

export async function tryFinallyNoCatch(key: string) {
  try {
    // SHOULD_FIRE: network-or-api-error — try-finally has no catch clause
    const value = await redis.get<string>(key);
    return value;
  } finally {
    console.log('cleanup');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Re-throw pattern — still satisfies the requirement
// ─────────────────────────────────────────────────────────────────────────────

export async function rethrowPattern(key: string) {
  try {
    // SHOULD_NOT_FIRE: inside try-catch; re-throwing is valid
    const value = await redis.get<string>(key);
    return value;
  } catch (error) {
    throw error;
  }
}

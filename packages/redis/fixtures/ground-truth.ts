/**
 * Redis Ground-Truth Fixture
 *
 * Each call site is annotated // SHOULD_FIRE or // SHOULD_NOT_FIRE.
 * Derived from the redis contract spec, NOT V1 behavior.
 *
 * Key contract rules:
 *   - createClient() without .on('error', handler) in same scope → SHOULD_FIRE: missing-error-listener
 *   - client.connect() without try-catch → SHOULD_FIRE: connect-no-error-handling
 *   - client.get()    without try-catch → SHOULD_FIRE: get-no-error-handling
 *   - client.set()    without try-catch → SHOULD_FIRE: set-no-error-handling
 *   - client.del()    without try-catch → SHOULD_FIRE: del-no-error-handling
 *
 * The missing-error-listener violation fires at the createClient() call line,
 * not at the point where the error listener would be registered.
 */

import { createClient } from 'redis';

// ─────────────────────────────────────────────────────────────────────────────
// 1. createClient without error listener
// ─────────────────────────────────────────────────────────────────────────────

export async function createWithoutErrorListener() {
  // SHOULD_FIRE: missing-error-listener — createClient without .on('error') crashes process
  const client = createClient({ url: 'redis://localhost:6379' });
  // No client.on('error', ...) registered — process crashes on any error
  await client.connect();
  return client;
}

export async function createWithErrorListener() {
  // SHOULD_NOT_FIRE: createClient followed by .on('error', handler) — requirement satisfied
  const client = createClient({ url: 'redis://localhost:6379' });
  client.on('error', (err) => console.error('Redis error:', err));
  return client;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. connect without try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function connectWithoutTryCatch() {
  const client = createClient();
  client.on('error', (err) => console.error('Redis error:', err));
  // SHOULD_FIRE: connect-no-error-handling — connect() can throw ECONNREFUSED, no try-catch
  await client.connect();
}

export async function connectWithTryCatch() {
  const client = createClient();
  client.on('error', (err) => console.error('Redis error:', err));
  try {
    // SHOULD_NOT_FIRE: connect inside try-catch satisfies error handling
    await client.connect();
  } catch (err: any) {
    console.error('Connection failed:', err.code);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. get without try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function getWithoutTryCatch(key: string) {
  const client = createClient();
  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();
  // SHOULD_FIRE: get-no-error-handling — client.get() can throw connection errors, no try-catch
  const value = await client.get(key);
  return value;
}

export async function getWithTryCatch(key: string) {
  const client = createClient();
  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();
  try {
    // SHOULD_NOT_FIRE: get inside try-catch satisfies error handling
    const value = await client.get(key);
    return value;
  } catch (err) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. set without try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function setWithoutTryCatch(key: string, value: string) {
  const client = createClient();
  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();
  // SHOULD_FIRE: set-no-error-handling — client.set() can throw connection errors, no try-catch
  await client.set(key, value);
}

export async function setWithTryCatch(key: string, value: string) {
  const client = createClient();
  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();
  try {
    // SHOULD_NOT_FIRE: set inside try-catch satisfies error handling
    await client.set(key, value);
  } catch (err) {
    console.error('Set failed:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. del without try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function delWithoutTryCatch(key: string) {
  const client = createClient();
  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();
  // SHOULD_FIRE: del-no-error-handling — client.del() can throw connection errors, no try-catch
  await client.del(key);
}

export async function delWithTryCatch(key: string) {
  const client = createClient();
  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();
  try {
    // SHOULD_NOT_FIRE: del inside try-catch satisfies error handling
    await client.del(key);
  } catch (err) {
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Class with proper error handling
// ─────────────────────────────────────────────────────────────────────────────

export class GoodRedisClient {
  private client = createClient();

  async init() {
    this.client.on('error', (err) => console.error('Redis error:', err));
    try {
      // SHOULD_NOT_FIRE: connect inside try-catch in class method is safe
      await this.client.connect();
    } catch (err) {
      throw err;
    }
  }

  async getValue(key: string) {
    try {
      // SHOULD_NOT_FIRE: get inside try-catch in class method is safe
      return await this.client.get(key);
    } catch (err) {
      return null;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Class without error listener on createClient
// ─────────────────────────────────────────────────────────────────────────────

export class BadRedisClient {
  // SHOULD_FIRE: missing-error-listener — createClient in class field, no .on('error') registered
  private client = createClient();

  async getValue(key: string) {
    try {
      // SHOULD_NOT_FIRE: get itself is inside try-catch (the separate missing-listener fires elsewhere)
      return await this.client.get(key);
    } catch (err) {
      return null;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Multiple calls — each bare call fires independently
// ─────────────────────────────────────────────────────────────────────────────

export async function multipleBareCalls(key1: string, key2: string) {
  const client = createClient();
  client.on('error', (err) => console.error(err));
  await client.connect();
  // SHOULD_FIRE: get-no-error-handling — first get, no try-catch
  const v1 = await client.get(key1);
  // SHOULD_FIRE: get-no-error-handling — second get, no try-catch
  const v2 = await client.get(key2);
  return { v1, v2 };
}

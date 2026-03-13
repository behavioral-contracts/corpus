/**
 * @elastic/elasticsearch Ground-Truth Fixture
 *
 * Each call site is annotated // SHOULD_FIRE or // SHOULD_NOT_FIRE.
 * Annotations are derived from the @elastic/elasticsearch contract spec (contract.yaml),
 * NOT from V1 behavior.
 *
 * Key contract rules:
 *   - All 6 contracted methods (search, index, get, delete, update, bulk) make
 *     HTTP requests and can throw ResponseError, ConnectionError, or TimeoutError
 *   - postcondition: api-error at severity:error requires a try-catch wrapper
 *   - try-finally WITHOUT catch does NOT satisfy the requirement
 *   - A .catch() chain on the promise SATISFIES the requirement
 *   - All methods are accessed via a Client instance (new Client(...))
 *
 * Contracted functions (all on Client class from '@elastic/elasticsearch'):
 *   - client.search()    postcondition: api-error
 *   - client.index()     postcondition: api-error
 *   - client.get()       postcondition: api-error
 *   - client.delete()    postcondition: api-error
 *   - client.update()    postcondition: api-error
 *   - client.bulk()      postcondition: api-error
 */

import { Client, errors } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200',
  auth: { apiKey: 'test-key' },
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. search() — bare call, no try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function searchNoCatch(indexName: string) {
  // SHOULD_FIRE: api-error — client.search makes HTTP request, no try-catch
  const result = await client.search({ index: indexName, query: { match_all: {} } });
  return result.hits.hits;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. search() — inside try-catch, no violation
// ─────────────────────────────────────────────────────────────────────────────

export async function searchWithCatch(indexName: string) {
  try {
    // SHOULD_NOT_FIRE: client.search inside try-catch satisfies api-error requirement
    const result = await client.search({ index: indexName, query: { match_all: {} } });
    return result.hits.hits;
  } catch (err) {
    if (err instanceof errors.ResponseError) {
      console.error('Search failed:', err.meta.statusCode);
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. search() — try-finally without catch, violation fires
// ─────────────────────────────────────────────────────────────────────────────

export async function searchTryFinallyNoCatch(indexName: string) {
  try {
    // SHOULD_FIRE: api-error — try-finally has no catch clause, error propagates uncaught
    const result = await client.search({ index: indexName, query: { match_all: {} } });
    return result.hits.hits;
  } finally {
    console.log('search complete');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. search() — with .catch() chain, satisfies requirement
// ─────────────────────────────────────────────────────────────────────────────

export function searchWithCatchChain(indexName: string) {
  // SHOULD_NOT_FIRE: .catch() chain satisfies error handling requirement
  return client.search({ index: indexName, query: { match_all: {} } })
    .catch(err => {
      console.error('Search error:', err);
      throw err;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. index() — bare call, no try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function indexNoCatch(id: string, doc: object) {
  // SHOULD_FIRE: api-error — client.index makes HTTP request, no try-catch
  const result = await client.index({ index: 'my-index', id, document: doc });
  return result._id;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. index() — inside try-catch, no violation
// ─────────────────────────────────────────────────────────────────────────────

export async function indexWithCatch(id: string, doc: object) {
  try {
    // SHOULD_NOT_FIRE: client.index inside try-catch satisfies api-error requirement
    const result = await client.index({ index: 'my-index', id, document: doc });
    return result._id;
  } catch (err) {
    console.error('Index failed:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. get() — bare call, no try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function getNoCatch(id: string) {
  // SHOULD_FIRE: api-error — client.get throws ResponseError(404) when doc absent, no try-catch
  const doc = await client.get({ index: 'my-index', id });
  return doc._source;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. get() — inside try-catch, no violation
// ─────────────────────────────────────────────────────────────────────────────

export async function getWithCatch(id: string) {
  try {
    // SHOULD_NOT_FIRE: client.get inside try-catch satisfies api-error requirement
    const doc = await client.get({ index: 'my-index', id });
    return doc._source;
  } catch (err) {
    if (err instanceof errors.ResponseError && err.meta.statusCode === 404) {
      return null;
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. delete() — bare call, no try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteNoCatch(id: string) {
  // SHOULD_FIRE: api-error — client.delete throws on 404 and network errors, no try-catch
  await client.delete({ index: 'my-index', id });
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. delete() — inside try-catch, no violation
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteWithCatch(id: string) {
  try {
    // SHOULD_NOT_FIRE: client.delete inside try-catch satisfies api-error requirement
    await client.delete({ index: 'my-index', id });
  } catch (err) {
    if (err instanceof errors.ResponseError && err.meta.statusCode === 404) {
      return; // Idempotent delete
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. update() — bare call, no try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function updateNoCatch(id: string, partialDoc: object) {
  // SHOULD_FIRE: api-error — client.update throws on 404/409 and network errors, no try-catch
  const result = await client.update({ index: 'my-index', id, doc: partialDoc });
  return result.result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. update() — inside try-catch, no violation
// ─────────────────────────────────────────────────────────────────────────────

export async function updateWithCatch(id: string, partialDoc: object) {
  try {
    // SHOULD_NOT_FIRE: client.update inside try-catch satisfies api-error requirement
    const result = await client.update({ index: 'my-index', id, doc: partialDoc });
    return result.result;
  } catch (err) {
    console.error('Update failed:', err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. bulk() — bare call, no try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function bulkNoCatch(docs: object[]) {
  const operations = docs.flatMap(doc => [{ index: { _index: 'my-index' } }, doc]);
  // SHOULD_FIRE: api-error — client.bulk throws on connection/HTTP failure, no try-catch
  const response = await client.bulk({ operations });
  return response.items.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. bulk() — inside try-catch, no violation
// ─────────────────────────────────────────────────────────────────────────────

export async function bulkWithCatch(docs: object[]) {
  const operations = docs.flatMap(doc => [{ index: { _index: 'my-index' } }, doc]);
  try {
    // SHOULD_NOT_FIRE: client.bulk inside try-catch satisfies api-error requirement
    const response = await client.bulk({ operations });
    if (response.errors) {
      console.warn('Some bulk operations failed');
    }
    return response.items.length;
  } catch (err) {
    console.error('Bulk failed:', err);
    throw err;
  }
}

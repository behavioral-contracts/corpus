/**
 * Axios Ground-Truth Fixture
 *
 * Each call site is annotated // SHOULD_FIRE or // SHOULD_NOT_FIRE.
 * Annotations are derived from the axios contract spec (contract.yaml),
 * NOT from V1 behavior.
 *
 * Key contract rules:
 *   - axios.get/post/put/delete/request all throw AxiosError on 4xx/5xx/network → MUST try-catch
 *   - postconditions with `throws` at severity:error require a try-catch wrapper
 *   - A try-catch wrapper (any catch block) satisfies the "must try-catch" requirement
 *   - catch-block completeness (429 handling, network vs HTTP distinction) generates warnings only
 */

import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Bare call — no try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function bareGetNoCatch() {
  // SHOULD_FIRE: error-4xx-5xx — axios.get throws AxiosError, no try-catch
  const r = await axios.get('https://api.example.com/users');
  return r.data;
}

export async function barePostNoCatch(data: object) {
  // SHOULD_FIRE: error-4xx-5xx — axios.post throws AxiosError, no try-catch
  const r = await axios.post('https://api.example.com/users', data);
  return r.data;
}

export async function barePutNoCatch(id: string, data: object) {
  // SHOULD_FIRE: error-handling — axios.put throws AxiosError, no try-catch
  const r = await axios.put(`https://api.example.com/users/${id}`, data);
  return r.data;
}

export async function bareDeleteNoCatch(id: string) {
  // SHOULD_FIRE: error-handling — axios.delete throws AxiosError, no try-catch
  const r = await axios.delete(`https://api.example.com/users/${id}`);
  return r.data;
}

export async function bareRequestNoCatch() {
  // SHOULD_FIRE: error-4xx-5xx — axios.request throws AxiosError, no try-catch
  const r = await axios.request({ method: 'GET', url: 'https://api.example.com/data' });
  return r.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Properly wrapped in try-catch — no violation expected
// ─────────────────────────────────────────────────────────────────────────────

export async function getWithTryCatch() {
  try {
    // SHOULD_NOT_FIRE: axios.get is inside try-catch — error-4xx-5xx requirement satisfied
    const r = await axios.get('https://api.example.com/users');
    return r.data;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

export async function postWithTryCatch(data: object) {
  try {
    // SHOULD_NOT_FIRE: axios.post is inside try-catch — error-4xx-5xx requirement satisfied
    const r = await axios.post('https://api.example.com/users', data);
    return r.data;
  } catch (err: any) {
    throw err;
  }
}

export async function getWithResponseCheck() {
  try {
    // SHOULD_NOT_FIRE: inside try-catch; catch checks error.response — network-failure handled
    const r = await axios.get('https://api.example.com/data');
    return r.data;
  } catch (err: any) {
    if (err.response) {
      console.error('HTTP error:', err.response.status);
    } else {
      console.error('Network error:', err.message);
    }
    throw err;
  }
}

export async function getWith429Handling() {
  try {
    // SHOULD_NOT_FIRE: inside try-catch; catch handles 429 explicitly
    const r = await axios.get('https://api.example.com/data');
    return r.data;
  } catch (err: any) {
    if (err.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Arrow functions
// ─────────────────────────────────────────────────────────────────────────────

export const arrowGetNoCatch = async () => {
  // SHOULD_FIRE: error-4xx-5xx — arrow function, no try-catch
  const r = await axios.get('https://api.example.com/data');
  return r.data;
};

export const arrowGetWithCatch = async () => {
  try {
    // SHOULD_NOT_FIRE: arrow function with try-catch is safe
    const r = await axios.get('https://api.example.com/data');
    return r.data;
  } catch (err) {
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Class methods
// ─────────────────────────────────────────────────────────────────────────────

export class ApiClient {
  async fetchUser(id: string) {
    // SHOULD_FIRE: error-4xx-5xx — class method, no try-catch
    const r = await axios.get(`https://api.example.com/users/${id}`);
    return r.data;
  }

  async safeCreateUser(data: object) {
    try {
      // SHOULD_NOT_FIRE: class method wrapped in try-catch
      const r = await axios.post('https://api.example.com/users', data);
      return r.data;
    } catch (err: any) {
      throw err;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. .catch() chain — satisfies the try-catch requirement
// ─────────────────────────────────────────────────────────────────────────────

export function getWithCatchChain() {
  // SHOULD_NOT_FIRE: .catch() chained on the promise satisfies error handling
  return axios.get('https://api.example.com/data').catch(err => {
    console.error(err);
    throw err;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Multiple calls in same function
// ─────────────────────────────────────────────────────────────────────────────

export async function multipleBareCalls() {
  // SHOULD_FIRE: error-4xx-5xx — first call, no try-catch
  const users = await axios.get('https://api.example.com/users');
  // SHOULD_FIRE: error-4xx-5xx — second call, no try-catch
  const posts = await axios.get('https://api.example.com/posts');
  return { users: users.data, posts: posts.data };
}

export async function mixedCoverage() {
  try {
    // SHOULD_NOT_FIRE: inside try-catch
    const users = await axios.get('https://api.example.com/users');
    return users.data;
  } catch (err) {
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Nested try blocks
// ─────────────────────────────────────────────────────────────────────────────

export async function nestedTryCatch() {
  try {
    try {
      // SHOULD_NOT_FIRE: nested inside try-catch — innermost try-catch satisfies requirement
      const r = await axios.get('https://api.example.com/data');
      return r.data;
    } catch (inner) {
      throw inner;
    }
  } catch (outer) {
    throw outer;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Axios instance (created via axios.create)
// ─────────────────────────────────────────────────────────────────────────────

const httpClient = axios.create({ baseURL: 'https://api.example.com', timeout: 5000 });

export async function instanceGetNoCatch() {
  // SHOULD_FIRE: error-4xx-5xx — axios instance.get, no try-catch
  const r = await httpClient.get('/users');
  return r.data;
}

export async function instanceGetWithCatch() {
  try {
    // SHOULD_NOT_FIRE: axios instance.get inside try-catch
    const r = await httpClient.get('/users');
    return r.data;
  } catch (err) {
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Re-throw patterns
// ─────────────────────────────────────────────────────────────────────────────

export async function rethrowPattern() {
  try {
    // SHOULD_NOT_FIRE: inside try-catch, even if catch re-throws (handling exists at this level)
    const r = await axios.get('https://api.example.com/data');
    return r.data;
  } catch (err) {
    // Re-throw is valid — caller handles it
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. try-finally without catch — no catch clause, SHOULD still fire
// ─────────────────────────────────────────────────────────────────────────────

export async function tryFinallyNoCatch() {
  try {
    // SHOULD_FIRE: error-4xx-5xx — try-finally has no catch clause, errors are NOT caught
    const r = await axios.get('https://api.example.com/data');
    return r.data;
  } finally {
    console.log('cleanup');
  }
}

/**
 * Demonstrates MISSING error handling for request-promise.
 * Should trigger ERROR violations.
 */
import rp from 'request-promise';

async function fetchDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await rp('https://api.example.com/data');
  return JSON.parse(response);
}

async function fetchWithOptionsNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await rp({
    uri: 'https://api.example.com/users',
    method: 'GET',
    json: true
  });
  return response;
}

async function postDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await rp.post({
    uri: 'https://api.example.com/users',
    body: { name: 'John' },
    json: true
  });
  return response;
}

async function putDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await rp.put({
    uri: 'https://api.example.com/users/123',
    body: { name: 'Jane' },
    json: true
  });
  return response;
}

async function deleteDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await rp.delete('https://api.example.com/users/123');
  return response;
}

async function patchDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await rp.patch({
    uri: 'https://api.example.com/users/123',
    body: { status: 'active' },
    json: true
  });
  return response;
}

async function headRequestNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await rp.head('https://api.example.com/users/123');
  return response;
}

// Promise without catch
function fetchNoPromiseCatch() {
  // ❌ No .catch() - should trigger violation
  return rp('https://api.example.com/data')
    .then(response => JSON.parse(response));
}

/**
 * Demonstrates MISSING error handling for got.
 * Should trigger ERROR violations.
 */
import got from 'got';

async function fetchDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await got('https://api.example.com/data');
  return JSON.parse(response.body);
}

async function fetchWithGetNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await got.get('https://api.example.com/users');
  return JSON.parse(response.body);
}

async function postDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await got.post('https://api.example.com/users', {
    json: { name: 'John' }
  });
  return JSON.parse(response.body);
}

async function putDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await got.put('https://api.example.com/users/123', {
    json: { name: 'Jane' }
  });
  return JSON.parse(response.body);
}

async function deleteDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await got.delete('https://api.example.com/users/123');
  return response.statusCode;
}

async function patchDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await got.patch('https://api.example.com/users/123', {
    json: { status: 'active' }
  });
  return JSON.parse(response.body);
}

// Promise without catch
function fetchNoPromiseCatch() {
  // ❌ No .catch() - should trigger violation
  return got('https://api.example.com/data')
    .then(response => JSON.parse(response.body));
}

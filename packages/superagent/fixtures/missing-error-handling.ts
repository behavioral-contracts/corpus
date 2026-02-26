/**
 * Demonstrates MISSING error handling for superagent.
 * Should trigger ERROR violations.
 */
import superagent from 'superagent';

async function fetchDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await superagent.get('https://api.example.com/data');
  return response.body;
}

async function postDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await superagent
    .post('https://api.example.com/users')
    .send({ name: 'John' });
  return response.body;
}

async function putDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await superagent
    .put('https://api.example.com/users/123')
    .send({ name: 'Jane' });
  return response.body;
}

async function deleteDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await superagent.delete('https://api.example.com/users/123');
  return response.status;
}

async function patchDataNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await superagent
    .patch('https://api.example.com/users/123')
    .send({ status: 'active' });
  return response.body;
}

async function headRequestNoErrorHandling() {
  // ❌ No try-catch - should trigger violation
  const response = await superagent.head('https://api.example.com/users/123');
  return response.status;
}

// Promise without catch
function fetchNoPromiseCatch() {
  // ❌ No .catch() - should trigger violation
  return superagent
    .get('https://api.example.com/data')
    .then(response => response.body);
}

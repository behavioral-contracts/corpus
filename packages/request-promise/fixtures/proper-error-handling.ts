/**
 * Demonstrates PROPER error handling for request-promise.
 * Should NOT trigger violations.
 */
import rp from 'request-promise';

async function fetchDataWithTryCatch() {
  try {
    const response = await rp('https://api.example.com/data');
    return JSON.parse(response);
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

async function fetchWithOptionsWithTryCatch() {
  try {
    const response = await rp({
      uri: 'https://api.example.com/users',
      method: 'GET',
      json: true
    });
    return response;
  } catch (error) {
    console.error('GET failed:', error);
    throw error;
  }
}

async function postDataWithTryCatch() {
  try {
    const response = await rp.post({
      uri: 'https://api.example.com/users',
      body: { name: 'John', email: 'john@example.com' },
      json: true
    });
    return response;
  } catch (error) {
    console.error('POST failed:', error);
    throw error;
  }
}

async function putDataWithTryCatch() {
  try {
    const response = await rp.put({
      uri: 'https://api.example.com/users/123',
      body: { name: 'Jane' },
      json: true
    });
    return response;
  } catch (error) {
    console.error('PUT failed:', error);
    throw error;
  }
}

async function deleteDataWithTryCatch() {
  try {
    const response = await rp.delete('https://api.example.com/users/123');
    return response;
  } catch (error) {
    console.error('DELETE failed:', error);
    throw error;
  }
}

// Using promise .catch()
function fetchWithPromiseCatch() {
  return rp('https://api.example.com/data')
    .then(response => JSON.parse(response))
    .catch(error => {
      console.error('Request failed:', error);
      throw error;
    });
}

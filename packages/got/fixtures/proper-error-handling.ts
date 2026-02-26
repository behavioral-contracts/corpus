/**
 * Demonstrates PROPER error handling for got.
 * Should NOT trigger violations.
 */
import got from 'got';

async function fetchDataWithTryCatch() {
  try {
    const response = await got('https://api.example.com/data');
    return JSON.parse(response.body);
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

async function fetchWithGetMethod() {
  try {
    const response = await got.get('https://api.example.com/users');
    return JSON.parse(response.body);
  } catch (error) {
    console.error('GET failed:', error);
    throw error;
  }
}

async function postDataWithTryCatch() {
  try {
    const response = await got.post('https://api.example.com/users', {
      json: { name: 'John', email: 'john@example.com' }
    });
    return JSON.parse(response.body);
  } catch (error) {
    console.error('POST failed:', error);
    throw error;
  }
}

async function putDataWithTryCatch() {
  try {
    const response = await got.put('https://api.example.com/users/123', {
      json: { name: 'Jane' }
    });
    return JSON.parse(response.body);
  } catch (error) {
    console.error('PUT failed:', error);
    throw error;
  }
}

async function deleteDataWithTryCatch() {
  try {
    const response = await got.delete('https://api.example.com/users/123');
    return response.statusCode;
  } catch (error) {
    console.error('DELETE failed:', error);
    throw error;
  }
}

// Using promise .catch()
function fetchWithPromiseCatch() {
  return got('https://api.example.com/data')
    .then(response => JSON.parse(response.body))
    .catch(error => {
      console.error('Request failed:', error);
      throw error;
    });
}

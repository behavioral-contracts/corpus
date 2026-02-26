/**
 * Demonstrates PROPER error handling for superagent.
 * Should NOT trigger violations.
 */
import superagent from 'superagent';

async function fetchDataWithTryCatch() {
  try {
    const response = await superagent.get('https://api.example.com/data');
    return response.body;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

async function postDataWithTryCatch() {
  try {
    const response = await superagent
      .post('https://api.example.com/users')
      .send({ name: 'John', email: 'john@example.com' });
    return response.body;
  } catch (error) {
    console.error('POST failed:', error);
    throw error;
  }
}

async function updateDataWithTryCatch() {
  try {
    const response = await superagent
      .put('https://api.example.com/users/123')
      .send({ name: 'Jane' });
    return response.body;
  } catch (error) {
    console.error('PUT failed:', error);
    throw error;
  }
}

async function deleteDataWithTryCatch() {
  try {
    const response = await superagent.delete('https://api.example.com/users/123');
    return response.status;
  } catch (error) {
    console.error('DELETE failed:', error);
    throw error;
  }
}

// Using promise .catch()
function fetchWithPromiseCatch() {
  return superagent
    .get('https://api.example.com/data')
    .then(response => response.body)
    .catch(error => {
      console.error('Request failed:', error);
      throw error;
    });
}

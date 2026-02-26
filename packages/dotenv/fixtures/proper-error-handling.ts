/**
 * Proper Error Handling for dotenv
 * Should produce 0 violations
 */

import * as dotenv from 'dotenv';

// ✅ Check config result for errors
function loadEnvironment() {
  const result = dotenv.config();
  
  if (result.error) {
    throw new Error(`Failed to load .env file: ${result.error.message}`);
  }
  
  // Validate required variables
  const required = ['DATABASE_URL', 'API_KEY', 'PORT'];
  for (const key of required) {
    if (\!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

// ✅ Try-catch around parse for malformed content
function parseEnvFile(content: string) {
  try {
    const parsed = dotenv.parse(content);
    return parsed;
  } catch (error) {
    console.error('Failed to parse .env content:', error);
    throw error;
  }
}

// ✅ Validate after loading
function loadWithValidation() {
  const result = dotenv.config({ path: '.env.local' });
  
  if (result.error) {
    console.warn('Could not load .env.local, using defaults');
    return;
  }
  
  // Check critical vars
  if (\!process.env.SECRET_KEY) {
    throw new Error('SECRET_KEY must be set');
  }
}

export { loadEnvironment, parseEnvFile, loadWithValidation };

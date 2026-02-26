/**
 * Missing Error Handling for dotenv
 * Should produce ERROR violations
 */

import * as dotenv from 'dotenv';

// ❌ No error checking on config
function loadEnvironmentNoCheck() {
  dotenv.config();
  // Missing: result.error check
  
  // Directly accessing env vars without validation
  const dbUrl = process.env.DATABASE_URL;
  console.log(`Connecting to: ${dbUrl}`);
}

// ❌ No try-catch on parse
function parseEnvFileNoErrorHandling(content: string) {
  const parsed = dotenv.parse(content); // Can throw SyntaxError
  return parsed;
}

// ❌ No validation of required vars
function loadWithoutValidation() {
  dotenv.config({ path: '.env.production' });
  
  // Assuming vars exist
  const apiKey = process.env.API_KEY;
  const port = process.env.PORT;
  
  return { apiKey, port };
}

// ❌ Silent failure
function silentLoadFailure() {
  const result = dotenv.config({ path: '/nonexistent/.env' });
  // No check of result.error - silent failure
  
  const secret = process.env.SECRET; // undefined
  return secret;
}

export { 
  loadEnvironmentNoCheck, 
  parseEnvFileNoErrorHandling, 
  loadWithoutValidation,
  silentLoadFailure
};

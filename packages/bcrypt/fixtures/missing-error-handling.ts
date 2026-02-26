/**
 * Missing Error Handling for bcrypt
 * Should produce ERROR violations
 */

import bcrypt from 'bcrypt';

// ❌ No try-catch around hash
async function hashPasswordNoErrorHandling(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

// ❌ No try-catch around compare
async function comparePasswordNoErrorHandling(password: string, hash: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

// ❌ No try-catch around genSalt
async function genSaltNoErrorHandling(): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return salt;
}

// ❌ Timing attack vulnerability - manual comparison
async function unsafePasswordCheck(password: string, storedHash: string): Promise<boolean> {
  const inputHash = await bcrypt.hash(password, 10);
  // ❌ Manual string comparison vulnerable to timing attacks
  return inputHash === storedHash;
}

// ❌ No error handling in authentication flow
async function authenticateNoErrorHandling(password: string, hash: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

export {
  hashPasswordNoErrorHandling,
  comparePasswordNoErrorHandling,
  genSaltNoErrorHandling,
  unsafePasswordCheck,
  authenticateNoErrorHandling
};

/**
 * Proper Error Handling for bcrypt
 * Should produce 0 violations
 */

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// ✅ Try-catch around hash
async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error('Failed to hash password:', error);
    throw error;
  }
}

// ✅ Try-catch around compare
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } catch (error) {
    console.error('Failed to compare password:', error);
    throw error;
  }
}

// ✅ Try-catch around genSalt
async function generateSalt(): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return salt;
  } catch (error) {
    console.error('Failed to generate salt:', error);
    throw error;
  }
}

// ✅ Proper password verification flow
async function authenticateUser(inputPassword: string, storedHash: string): Promise<boolean> {
  try {
    // ✅ Using compare() to prevent timing attacks
    const isValid = await bcrypt.compare(inputPassword, storedHash);
    return isValid;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

export { hashPassword, verifyPassword, generateSalt, authenticateUser };

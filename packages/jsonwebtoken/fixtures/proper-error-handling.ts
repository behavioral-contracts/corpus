/**
 * Proper Error Handling for jsonwebtoken
 * Should produce 0 violations
 */

import jwt from 'jsonwebtoken';

const SECRET = 'your-secret-key';
const PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\n...';

// ✅ Try-catch around verify with algorithms specified
function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET, {
      algorithms: ['HS256'] // ✅ CVE-2015-9235 mitigation
    });
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expired:', error.expiredAt);
    } else if (error instanceof jwt.NotBeforeError) {
      console.error('Token not yet valid:', error.date);
    }
    throw error;
  }
}

// ✅ Try-catch around sign
function createToken(payload: object) {
  try {
    const token = jwt.sign(payload, SECRET, {
      expiresIn: '1h',
      algorithm: 'HS256'
    });
    return token;
  } catch (error) {
    console.error('Failed to sign token:', error);
    throw error;
  }
}

// ✅ RSA verification with algorithms specified
function verifyRSAToken(token: string) {
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'] // ✅ Prevents algorithm confusion
    });
    return decoded;
  } catch (error) {
    console.error('RSA verification failed:', error);
    throw error;
  }
}

export { verifyToken, createToken, verifyRSAToken };

/**
 * Missing Error Handling for jsonwebtoken
 * Should produce ERROR violations
 */

import jwt from 'jsonwebtoken';

const SECRET = 'your-secret-key';

// ❌ No try-catch around verify
function verifyTokenNoErrorHandling(token: string) {
  const decoded = jwt.verify(token, SECRET);
  return decoded;
}

// ❌ Missing algorithms option (CVE-2015-9235)
function verifyWithoutAlgorithms(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET); // ❌ No algorithms specified
    return decoded;
  } catch (error) {
    throw error;
  }
}

// ❌ No try-catch on sign
function signTokenNoErrorHandling(payload: object) {
  const token = jwt.sign(payload, SECRET);
  return token;
}

// ❌ Vulnerable to algorithm confusion
function vulnerableVerify(token: string, publicKey: string) {
  const decoded = jwt.verify(token, publicKey); // ❌ Attacker can switch RS256 to HS256
  return decoded;
}

// ❌ decode() used for authentication (wrong\!)
function unsafeAuthentication(token: string) {
  const decoded = jwt.decode(token); // ❌ No signature verification\!
  if (decoded && typeof decoded === 'object' && decoded.userId) {
    return decoded.userId;
  }
  return null;
}

export {
  verifyTokenNoErrorHandling,
  verifyWithoutAlgorithms,
  signTokenNoErrorHandling,
  vulnerableVerify,
  unsafeAuthentication
};

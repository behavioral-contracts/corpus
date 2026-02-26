# Undici - Behavioral Contract Sources

## Package Information
- **Package Name:** undici
- **Contract Version:** 1.0.0
- **Last Verified:** 2026-02-26

## Primary Sources

### Official Documentation
- [Undici npm package](https://www.npmjs.com/package/undici)
- [GitHub Repository](https://github.com/nodejs/undici)
- [Node.js Fetch Documentation](https://nodejs.org/en/learn/getting-started/fetch)
- [Undici Official Docs](https://undici.nodejs.org/)

## Behavioral Claims

### Network Error Handling
**Claim:** Both `request()` and `fetch()` methods can throw errors on network failures, DNS errors, timeouts, or connection refused.

**Evidence:**
- Undici is the HTTP/1.1 client written from scratch for Node.js
- Node.js's built-in fetch is powered by undici (available globally since Node.js v18+)
- Both low-level `request()` and high-level `fetch()` APIs return promises
- Network errors cause promise rejection

**Source References:**
- Documentation: https://www.npmjs.com/package/undici
- Node.js fetch docs: https://nodejs.org/en/learn/getting-started/fetch
- Official site: https://undici.nodejs.org/

## Important Notes

**Node.js Integration:** Undici v6.x is bundled in Node.js 20.x and 22.x. Undici v7.x is bundled in Node.js 24.x.

**Fetch API:** Undici's `fetch()` provides a WHATWG Fetch API implementation for Node.js, similar to browser fetch but without CORS checks by default.

**Low-Level API:** The `request()` function provides lower-level access to HTTP requests with more control over streams and responses.

## Contract Justification

Undici is a modern, fast HTTP client for Node.js that powers Node's native fetch. It makes network requests that can fail due to:
- Network connectivity issues
- DNS resolution failures
- Connection timeouts
- Server unavailability

Both `request()` and `fetch()` methods return promises that reject on errors, requiring explicit error handling.

## Verification Date
2026-02-26

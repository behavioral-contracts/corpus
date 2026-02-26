# Got - Behavioral Contract Sources

## Package Information
- **Package Name:** got
- **Contract Version:** 1.0.0
- **Last Verified:** 2026-02-26

## Primary Sources

### Official Documentation
- [Got npm package](https://www.npmjs.com/package/got)
- [GitHub Repository](https://github.com/sindresorhus/got)
- [Got Documentation](https://github.com/sindresorhus/got/tree/main/documentation)

## Behavioral Claims

### Network Error Handling
**Claim:** All HTTP methods (default function, get, post, put, delete, patch) can throw RequestError or HTTPError on network failures, DNS errors, timeouts, connection refused, or HTTP errors.

**Evidence:**
- Got is promise-based and throws typed errors
- RequestError for network-level failures
- HTTPError for HTTP status code errors (4xx, 5xx)
- Supports automatic retries but still requires error handling

**Source References:**
- Documentation: https://www.npmjs.com/package/got
- Error types documented in official repository
- Got v11+ uses native promises

## Contract Justification

Got is a human-friendly and powerful HTTP request library for Node.js. It's known for:
- Better error handling than alternatives
- Automatic retries (but still requires handling)
- Support for HTTP/2
- Strong TypeScript support

All HTTP methods return promises that reject on:
- Network connectivity issues
- DNS resolution failures
- Connection timeouts
- HTTP error status codes
- Server unavailability

## Verification Date
2026-02-26

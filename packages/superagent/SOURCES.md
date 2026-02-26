# SuperAgent - Behavioral Contract Sources

## Package Information
- **Package Name:** superagent
- **Contract Version:** 1.0.0
- **Last Verified:** 2026-02-26

## Primary Sources

### Official Documentation
- [SuperAgent npm package](https://www.npmjs.com/package/superagent)
- [SuperAgent Documentation](https://forwardemail.github.io/superagent/)
- [GitHub Repository](https://github.com/forwardemail/superagent)

## Behavioral Claims

### Network Error Handling
**Claim:** All HTTP methods (get, post, put, delete, patch, head) can throw errors on network failures, DNS errors, timeouts, or connection refused.

**Evidence:**
- SuperAgent supports promises, callbacks, and async/await syntax
- Network errors reject promises or are passed to error callbacks
- Requires explicit error handling via try-catch or .catch()

**Source References:**
- Documentation: https://www.npmjs.com/package/superagent
- Error handling examples in official docs

## Contract Justification

SuperAgent is a widely-used HTTP client for Node.js and browsers. Like axios and node-fetch, it makes network requests that can fail due to:
- Network connectivity issues
- DNS resolution failures
- Connection timeouts
- Server unavailability

All HTTP methods require error handling to prevent unhandled promise rejections.

## Verification Date
2026-02-26

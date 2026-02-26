# Request-Promise - Behavioral Contract Sources

## Package Information
- **Package Name:** request-promise
- **Contract Version:** 1.0.0
- **Last Verified:** 2026-02-26

## Primary Sources

### Official Documentation
- [Request-Promise npm package](https://www.npmjs.com/package/request-promise)
- [GitHub Repository](https://github.com/request/request-promise)
- [Request-Promise API Documentation](https://npmdoc.github.io/node-npmdoc-request-promise/build/apidoc.html)

## Behavioral Claims

### Network Error Handling
**Claim:** All HTTP methods (default, get, post, put, delete, patch, head) can throw StatusCodeError or RequestError on network failures, DNS errors, timeouts, connection refused, or HTTP errors.

**Evidence:**
- Request-Promise wraps the 'request' library with Bluebird promises
- StatusCodeError for non-2xx HTTP status codes (when simple=true, default)
- RequestError for network-level failures
- Promise rejection requires .catch() or try-catch handling

**Source References:**
- Documentation: https://www.npmjs.com/package/request-promise
- Error types: StatusCodeError, RequestError
- API guide: https://npmdoc.github.io/node-npmdoc-request-promise/build/apidoc.html

## Important Notes

**Maintenance Mode:** The underlying 'request' library is in maintenance mode (no new features, only bug fixes). However, it's still widely used in existing codebases.

**Promise Support:** Request-Promise adds full Bluebird promise support to the request library, making it suitable for async/await patterns.

## Contract Justification

Request-Promise is a promisified version of the popular 'request' HTTP client. It makes network requests that can fail due to:
- Network connectivity issues
- DNS resolution failures
- Connection timeouts
- HTTP error status codes
- Server unavailability

All HTTP methods return promises that reject on errors, requiring explicit error handling.

## Verification Date
2026-02-26

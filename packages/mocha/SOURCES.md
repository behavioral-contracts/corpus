# Sources: mocha

**Package:** mocha
**Contract Version:** 1.0.0
**Last Verified:** 2026-02-26

---

## Primary Sources

### Official Documentation
- **Asynchronous Code**: https://mochajs.org/#asynchronous-code
  - Documents promise-based and async/await test patterns
  - Explains how Mocha handles async test failures

- **Hooks**: https://mochajs.org/#hooks
  - Documents before/after/beforeEach/afterEach hooks
  - Explains async hook handling

### NPM Package
- **Package Page**: https://www.npmjs.com/package/mocha
  - Installation and basic usage

### Repository
- **GitHub**: https://github.com/mochajs/mocha
  - Source code and issues

---

## Behavioral Claims

### Async Test Handling
**Claim:** Test functions that return promises or use async/await must handle rejections properly.

**Evidence:**
- Mocha documentation states that returning a promise from a test automatically makes it async
- Unhandled rejections in async tests cause UnhandledPromiseRejectionWarning
- Source: https://mochajs.org/#asynchronous-code

**Severity:** Warning (test failures, not production crashes)

---

### Hook Error Handling
**Claim:** Before/after hooks with async operations must handle promise rejections.

**Evidence:**
- Hooks follow same async rules as tests
- Unhandled rejections in hooks cause test suite failures
- Source: https://mochajs.org/#hooks

**Severity:** Warning

---

## Notes

- Mocha has built-in async support but doesn't protect against all unhandled rejections
- Modern Mocha (8+) has better async handling than older versions
- Primarily a test-time concern, not production runtime

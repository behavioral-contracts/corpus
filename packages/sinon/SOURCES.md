# Sources: sinon

**Package:** sinon
**Contract Version:** 1.0.0
**Last Verified:** 2026-02-26

---

## Primary Sources

### Official Documentation
- **Stubs**: https://sinonjs.org/releases/latest/stubs/
  - Documents stub.throws() configuration
  - Stubs can be configured to throw errors

- **Mocks**: https://sinonjs.org/releases/latest/mocks/
  - Documents mock.verify() throwing ExpectationError
  - Mock expectations and verification

- **Fakes**: https://sinonjs.org/releases/latest/fakes/
  - Documents fake.throws() configuration

### NPM Package
- **Package Page**: https://www.npmjs.com/package/sinon
  - Installation and basic usage

### Repository
- **GitHub**: https://github.com/sinonjs/sinon
  - Source code and issues

---

## Behavioral Claims

### Stubs and Fakes Can Throw
**Claim:** Stubs and fakes configured with .throws() will throw errors when called.

**Evidence:**
- API documentation shows stub.throws(error) and fake.throws(error)
- This is intentional behavior for testing error handling
- Source: https://sinonjs.org/releases/latest/stubs/

**Severity:** Info (expected test behavior, not a bug)

---

### Mock Verification Throws
**Claim:** mock.verify() throws ExpectationError when expectations are not met.

**Evidence:**
- Mock verification is designed to throw on expectation failures
- This is normal test assertion behavior
- Source: https://sinonjs.org/releases/latest/mocks/

**Severity:** Info (expected test behavior)

---

## Notes

- Sinon is a test utility library
- Errors thrown are intentional for testing purposes
- Severity is "info" because these are expected behaviors in test code

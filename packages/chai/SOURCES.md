# Sources: chai

**Package:** chai
**Contract Version:** 1.0.0
**Last Verified:** 2026-02-26

---

## Primary Sources

### Official Documentation
- **BDD API**: https://www.chaijs.com/api/bdd/
  - Documents expect and should assertion styles
  - All assertions throw AssertionError on failure

- **Assert API**: https://www.chaijs.com/api/assert/
  - Documents assert-style assertions
  - Throws AssertionError on failure

### NPM Package
- **Package Page**: https://www.npmjs.com/package/chai
  - Installation and basic usage

### Repository
- **GitHub**: https://github.com/chaijs/chai
  - Source code and issues

---

## Behavioral Claims

### Assertion Failures Throw
**Claim:** All chai assertions throw AssertionError when the assertion fails.

**Evidence:**
- BDD API (expect/should) throws on failure
- Assert API throws on failure
- This is the fundamental behavior of assertion libraries
- Source: https://www.chaijs.com/api/

**Severity:** Warning (primarily test-time, but can be misused in production)

---

## Notes

- Chai is designed for testing, not production validation
- If assertions are used outside test code, they need error handling
- Severity is "warning" because this is primarily a testing library

# Sources: yup

**Package:** yup
**Contract Version:** 1.0.0
**Last Verified:** 2026-02-26

---

## Primary Sources

### Official Documentation
- **validate()**: https://github.com/jquense/yup#schemavalidatevalue-options-promise
  - Asynchronous validation that returns a Promise
  - Rejects with ValidationError on failure

- **validateSync()**: https://github.com/jquense/yup#schemavalidatesyncvalue-options-any
  - Synchronous validation
  - Throws ValidationError on failure

- **validateAt()**: https://github.com/jquense/yup#schemavalidateatpath-string-value-any-options-object-promise
  - Validates specific path asynchronously
  - Rejects with ValidationError on failure

- **validateSyncAt()**: https://github.com/jquense/yup#schemavalidatesyncat-path-string-value-any-options-object-any
  - Validates specific path synchronously
  - Throws ValidationError on failure

### NPM Package
- **Package Page**: https://www.npmjs.com/package/yup
  - Installation and basic usage

### Repository
- **GitHub**: https://github.com/jquense/yup
  - Source code and documentation

---

## Behavioral Claims

### Validation Methods Throw/Reject
**Claim:** All validation methods (validate, validateSync, validateAt, validateSyncAt) throw or reject with ValidationError when validation fails.

**Evidence:**
- Documentation explicitly states that validate() rejects on failure
- Documentation states that validateSync() throws on failure
- This is the core behavior of the library
- Source: https://github.com/jquense/yup#api

**Severity:** Error (validation failures in production can lead to security issues and data corruption)

---

## Notes

- Yup is similar to Joi and Zod in purpose
- Async methods reject promises, sync methods throw
- Without error handling, invalid data passes through to application logic
- Commonly used in form validation (React, Next.js, etc.)

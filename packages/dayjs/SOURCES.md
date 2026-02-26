# Sources: dayjs

**Package:** dayjs
**Contract Version:** 1.0.0
**Last Verified:** 2026-02-26

---

## Primary Sources

### Official Documentation
- **Parsing Strings**: https://day.js.org/docs/en/parse/string
  - Documents that dayjs() can return invalid objects
  - Invalid dates do not throw errors
  - Must use isValid() to check

- **UTC Plugin**: https://day.js.org/docs/en/plugin/utc
  - UTC parsing behaves the same way
  - Returns invalid object on bad input

- **Validation**: https://day.js.org/docs/en/parse/is-valid
  - isValid() returns boolean indicating if date is valid
  - Invalid objects are created for bad input

### NPM Package
- **Package Page**: https://www.npmjs.com/package/dayjs
  - Installation and basic usage
  - 2KB immutable date library

### Repository
- **GitHub**: https://github.com/iamkun/dayjs
  - Source code and documentation
  - Modern alternative to moment.js

---

## Behavioral Claims

### Invalid Date Parsing Returns Invalid Object
**Claim:** dayjs() and dayjs.utc() return invalid Day.js objects for bad input instead of throwing.

**Evidence:**
- Documentation states invalid input creates invalid objects
- isValid() method exists to check validity
- API is intentionally compatible with moment.js
- Source: https://day.js.org/docs/en/parse/

**Severity:** Error (invalid dates cause calculation errors and data corruption)

---

## Notes

- Day.js is designed as a moment.js replacement
- Much smaller (2KB vs 16KB for moment)
- Immutable objects (unlike moment)
- Same error pattern as moment: returns invalid object instead of throwing
- Plugin-based architecture for extended functionality

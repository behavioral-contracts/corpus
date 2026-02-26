# Sources: moment

**Package:** moment
**Contract Version:** 1.0.0
**Last Verified:** 2026-02-26

---

## Primary Sources

### Official Documentation
- **Parsing Strings**: https://momentjs.com/docs/#/parsing/string/
  - Documents that moment() can return invalid moment objects
  - Invalid dates do not throw errors
  - Must use isValid() to check

- **UTC Parsing**: https://momentjs.com/docs/#/parsing/utc/
  - Same behavior for UTC parsing
  - Returns invalid moment on bad input

- **Validation**: https://momentjs.com/docs/#/parsing/is-valid/
  - isValid() returns boolean indicating if moment is valid
  - Invalid moments are created for bad input

### NPM Package
- **Package Page**: https://www.npmjs.com/package/moment
  - Installation and basic usage
  - Note: In maintenance mode

### Repository
- **GitHub**: https://github.com/moment/moment
  - Source code and documentation
  - Maintenance mode since 2020

---

## Behavioral Claims

### Invalid Date Parsing Returns Invalid Moment
**Claim:** moment() and moment.utc() return invalid moment objects for bad input instead of throwing.

**Evidence:**
- Documentation states invalid input creates invalid moment objects
- isValid() method exists specifically to check validity
- No exceptions are thrown for invalid dates
- Source: https://momentjs.com/docs/#/parsing/

**Severity:** Error (invalid dates cause calculation errors and data corruption)

---

## Notes

- Moment.js is in maintenance mode (no new features)
- Recommended alternatives: day.js, luxon, date-fns
- Still widely used in legacy codebases
- Does NOT throw on invalid input - returns invalid object instead
- This is different from newer libraries like luxon which are more explicit

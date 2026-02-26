# Sources: luxon

**Package:** luxon
**Contract Version:** 1.0.0
**Last Verified:** 2026-02-26

---

## Primary Sources

### Official Documentation
- **DateTime.fromISO**: https://moment.github.io/luxon/api-docs/index.html#datetimefromiso
  - Returns invalid DateTime on bad input
  - Does not throw exceptions

- **DateTime.fromFormat**: https://moment.github.io/luxon/api-docs/index.html#datetimefromformat
  - Returns invalid DateTime when format doesn't match
  - Provides invalidReason and invalidExplanation properties

- **DateTime.fromSQL**: https://moment.github.io/luxon/api-docs/index.html#datetimefromsql
  - Returns invalid DateTime for non-SQL formats

- **DateTime.fromHTTP**: https://moment.github.io/luxon/api-docs/index.html#datetimefromhttp
  - Returns invalid DateTime for non-HTTP date formats

- **DateTime.fromRFC2822**: https://moment.github.io/luxon/api-docs/index.html#datetimefromrfc2822
  - Returns invalid DateTime for non-RFC2822 formats

- **Validity**: https://moment.github.io/luxon/docs/manual/validity.html
  - Documents isValid property
  - Documents invalidReason and invalidExplanation
  - Invalid objects are created instead of throwing

### NPM Package
- **Package Page**: https://www.npmjs.com/package/luxon
  - Installation and basic usage

### Repository
- **GitHub**: https://github.com/moment/luxon
  - Source code and documentation
  - Created by moment.js team

---

## Behavioral Claims

### Parse Methods Return Invalid Objects
**Claim:** All DateTime.from*() parsing methods return invalid DateTime objects instead of throwing exceptions.

**Evidence:**
- Documentation states all parsing methods return invalid objects on failure
- isValid property is false for invalid objects
- invalidReason and invalidExplanation provide error details
- Source: https://moment.github.io/luxon/docs/manual/validity.html

**Severity:** Error (invalid dates cause calculation errors and data corruption)

---

## Invalid Object Properties

When a DateTime is invalid:
- `dt.isValid` → false
- `dt.invalidReason` → string describing why (e.g., "unparsable")
- `dt.invalidExplanation` → more detailed explanation

---

## Notes

- Luxon is the modern successor to moment.js (by same team)
- Immutable objects
- Built on native Intl API for internationalization
- Better timezone support than moment
- Does NOT throw on invalid input - returns invalid object with error properties
- More explicit error handling than moment/dayjs

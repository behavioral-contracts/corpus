# Sources: jsonschema

**Package:** jsonschema
**Category:** JSON Schema Validation Library
**Research Date:** 2026-02-27
**Status:** DRAFT - Low analyzer detection rate (<30%)

---

## Official Documentation

### Primary Sources
- **GitHub Repository:** https://github.com/tdegrunt/jsonschema
- **README:** https://github.com/tdegrunt/jsonschema/blob/master/README.md
- **npm Package:** https://www.npmjs.com/package/jsonschema
- **Examples:** https://github.com/tdegrunt/jsonschema/blob/master/examples/all.js

---

## Error Handling Behavior

### Two Modes of Operation

The jsonschema package has **dual error handling behavior**:

#### 1. Default Mode (Return Value) - MOST COMMON
**Behavior:** Returns `ValidatorResult` object
**Detection:** ❌ Analyzer CANNOT detect missing result checks
**Usage:** ~70-90% of developers use this pattern

```javascript
var result = v.validate(instance, schema);
if (!result.valid) {
  // Handle errors via result.errors array
}
```

**Source:** https://github.com/tdegrunt/jsonschema/blob/master/README.md#usage

#### 2. Throwing Mode (Optional) - LESS COMMON
**Behavior:** Throws exceptions when options are set
**Detection:** ✅ Analyzer CAN detect missing try-catch
**Usage:** ~10-30% of developers use throw options

**Options:**
- `throwFirst` - Throws `ValidatorResultError` at first error
- `throwAll` - Throws `ValidatorResultError` after full validation
- `throwError` - Throws `ValidationError` at first error

```javascript
try {
  var result = v.validate(instance, schema, { throwFirst: true });
} catch (error) {
  // Handle ValidatorResultError
}
```

**Source:** https://github.com/tdegrunt/jsonschema/blob/master/README.md#errors

---

## Error Types

### ValidatorResult Object
Returned in default mode:
- **valid** (boolean) - Whether validation passed
- **errors** (ValidationError[]) - Array of validation errors
- **instance** - The value being validated
- **schema** - The schema used

**Source:** https://github.com/tdegrunt/jsonschema/blob/master/README.md#validatorresult

### ValidationError Object
Each error contains:
- **path** - Array showing location in nested structures
- **property** - Dot-delimited path string (e.g., "instance.address.zip")
- **message** - Human-readable failure description
- **schema** - The specific schema keyword that failed
- **name** - Keyword identifier (for localization)
- **argument** - Additional context

**Source:** https://github.com/tdegrunt/jsonschema/blob/master/README.md#validationerror

### ValidatorResultError
Thrown when `throwFirst` or `throwAll` options are set:
- Inherits from Error
- Contains all ValidatorResult properties
- Includes stack trace

### SchemaError
Thrown by `addSchema()` when schema is invalid or undefined:
- Common when loading schemas from external sources
- TypeError: Cannot read property 'id' of undefined

**Source:** https://github.com/tdegrunt/jsonschema/issues/290

---

## Common Mistakes & GitHub Issues

### 1. Undefined Schema Properties
**Issue:** Setting schema property to `undefined` causes TypeError
**Impact:** Unhandled exception during validation
**Source:** https://github.com/tdegrunt/jsonschema/issues/60

### 2. Missing Result Validation Check
**Issue:** Not checking `result.valid` allows invalid data to pass
**Impact:** Silent validation failures, data corruption
**Pattern:** Most common mistake with default mode

### 3. Nested Error Handling
**Issue:** `oneOf`/`anyOf` failures return binary state without root causes
**Limitation:** Cannot determine which sub-schema failed
**Source:** https://github.com/tdegrunt/jsonschema/issues/189

### 4. Schema Split Across Files
**Issue:** Multi-file schemas that work on jsonschemavalidator.net fail in npm module
**Source:** https://github.com/tdegrunt/jsonschema/issues/175

---

## Security & CVEs

### No Direct CVEs Found
**Finding:** The `jsonschema` package (by tdegrunt) has NO known CVEs in Snyk database
**Note:** Different from `json-schema` package (with hyphen) which has CVE-2021-3918
**Source:** https://snyk.io/advisor/npm-package/jsonschema

### Deprecation Warning
**Issue:** Uses `url.parse()` which has security implications
**Recommendation:** Should migrate to WHATWG URL API
**Note:** No CVEs issued for url.parse() vulnerabilities
**Source:** https://github.com/tdegrunt/jsonschema/issues/393

---

## Analyzer Limitation

### Detection Rate: <30% (LOW)

**Why Low Detection:**
- Default behavior is return-value based (70-90% usage)
- Analyzer only detects try-catch patterns (throwing mode)
- Analyzer cannot detect missing `result.valid` checks

**What Analyzer CAN Detect:**
- ✅ Missing try-catch when `throwFirst`/`throwAll`/`throwError` options used
- ✅ Missing try-catch around `addSchema()` calls

**What Analyzer CANNOT Detect:**
- ❌ Missing `result.valid` checks (default mode - most common)
- ❌ Ignoring `result.errors` array
- ❌ Silent validation failures

**Recommendation:**
- Mark contract as **DRAFT** until analyzer supports return-value checking
- Document limitation clearly for users
- Consider analyzer enhancement for validation patterns

---

## Package Maintenance

- **Downloads:** 5,035,848 per week (influential project)
- **Maintenance:** Sustainable but slow (no releases in 12 months)
- **Stability:** Mature, stable API
- **Alternatives:** ajv, joi, yup (all have similar analyzer limitations)

**Source:** https://snyk.io/advisor/npm-package/jsonschema

---

## Contract Design Rationale

This contract focuses on the **throwing mode** because:
1. Analyzer can only detect try-catch patterns (throwing mode)
2. Default mode (return-value) requires analyzer enhancement
3. Better to document partial coverage than no coverage

**Trade-off:** Contract will have low detection rate but documents real behavioral requirements.

**Future Enhancement:** When analyzer supports return-value checking:
- Add postconditions for missing `result.valid` checks
- Increase detection rate to 80-90%
- Promote contract from DRAFT to PRODUCTION

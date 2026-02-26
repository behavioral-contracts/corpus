# Sources: ajv

**Package:** ajv
**Contract Version:** 1.0.0
**Last Verified:** 2026-02-26

---

## Primary Sources

### Official Documentation
- **Getting Started**: https://ajv.js.org/guide/getting-started.html#basic-data-validation
  - Documents validate() returning boolean
  - Errors stored in ajv.errors when validation fails
  - compile() can throw on invalid schemas

- **API Reference**: https://ajv.js.org/api.html
  - validateSchema() API documentation
  - Returns false when schema is invalid

### NPM Package
- **Package Page**: https://www.npmjs.com/package/ajv
  - Installation and basic usage

### Repository
- **GitHub**: https://github.com/ajv-validator/ajv
  - Source code and documentation

---

## Behavioral Claims

### validate() Returns False on Failure
**Claim:** validate() returns false when data fails validation, with errors in ajv.errors.

**Evidence:**
- Documentation shows validate() returns boolean
- False indicates validation failure
- Errors are accessible via ajv.errors property
- Source: https://ajv.js.org/guide/getting-started.html#basic-data-validation

**Severity:** Error (unchecked validation allows invalid data)

---

### compile() Can Throw
**Claim:** compile() throws an error when schema is invalid or malformed.

**Evidence:**
- Documentation indicates compile() can throw on invalid schemas
- Schema compilation errors are synchronous exceptions
- Source: https://ajv.js.org/guide/getting-started.html

**Severity:** Warning (primarily affects schema loading, not runtime validation)

---

### validateSchema() Returns False
**Claim:** validateSchema() returns false when schema is invalid.

**Evidence:**
- API documentation shows boolean return type
- False indicates schema validation failure
- Source: https://ajv.js.org/api.html#validateschema-schema-object-boolean

**Severity:** Warning (schema validation is usually done at startup)

---

## Notes

- Ajv uses a different error pattern than Joi/Yup (returns false vs throws)
- Errors are stored in ajv.errors property, not thrown
- Very fast JSON schema validator, widely used in APIs
- Different from Joi/Yup/Zod which throw on validation failure

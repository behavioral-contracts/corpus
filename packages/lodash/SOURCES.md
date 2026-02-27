# Sources: lodash

## Official Documentation
- npm: https://www.npmjs.com/package/lodash
- Website: https://lodash.com/docs/
- GitHub: https://github.com/lodash/lodash

## Behavioral Evidence

### Prototype Pollution Vulnerabilities

Lodash has multiple documented prototype pollution vulnerabilities affecting functions that accept user-supplied objects or property paths:

**CVE-2025-13465** (CVSS 6.5 - Moderate)
- **Affected functions:** `_.unset`, `_.omit`
- **Vulnerable versions:** 4.0.0 - 4.17.22
- **Patched version:** 4.17.23
- **Behavior:** Attackers can pass crafted paths to delete methods from global prototypes
- **Required handling:** Validate paths to exclude `__proto__`, `constructor`, `prototype`
- **Reference:** https://github.com/lodash/lodash/security/advisories/GHSA-xxjr-mmjv-4gpg

**CVE-2020-8203** (CVSS 7.4 - High)
- **Affected functions:** `_.zipObjectDeep`
- **Vulnerable versions:** < 4.17.20
- **Patched version:** 4.17.20
- **Behavior:** Prototype pollution via specially crafted property paths
- **Required handling:** Validate property paths before use with untrusted input
- **Reference:** https://security.snyk.io/vuln/SNYK-JS-LODASH-590103

**CVE-2019-10744** (CVSS 9.8 - Critical)
- **Affected functions:** `_.merge`, `_.mergeWith`, `_.defaultsDeep`, `_.setWith`
- **Vulnerable versions:** < 4.17.12
- **Patched version:** 4.17.12
- **Behavior:** Prototype pollution via `{constructor: {prototype: {...}}}`
- **Required handling:** Validate input objects to exclude dangerous keys
- **Reference:** https://snyk.io/blog/snyk-research-team-discovers-severe-prototype-pollution-security-vulnerabilities-affecting-all-versions-of-lodash/

### Validation Pattern

When using vulnerable functions with untrusted input:

```typescript
// Validate object keys
function hasDangerousKeys(obj: any): boolean {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  return Object.keys(obj).some(key => dangerousKeys.includes(key));
}

// Validate property paths
function hasDangerousPath(path: string): boolean {
  return path.includes('__proto__') ||
         path.includes('constructor') ||
         path.includes('prototype');
}

// Safe usage
if (!hasDangerousKeys(userInput)) {
  _.merge(config, userInput); // OK
}

if (!hasDangerousPath(userPath)) {
  _.unset(obj, userPath); // OK
}
```

### Error Propagation in Async Functions

**Issue:** `_.debounce` breaks error propagation for async functions
- **Affected functions:** `_.debounce`, `_.throttle`
- **Behavior:** Errors from async functions don't propagate to caller's catch block
- **Required handling:** Handle errors inside the debounced function
- **Reference:** https://github.com/lodash/lodash/issues/4449

```typescript
// WRONG - errors won't propagate
const debounced = _.debounce(async () => {
  await riskyOperation(); // Error becomes unhandled rejection
}, 100);

try {
  await debounced(); // catch won't fire
} catch (e) {
  // Won't reach here
}

// CORRECT - handle errors inside
const debounced = _.debounce(async () => {
  try {
    await riskyOperation();
  } catch (e) {
    handleError(e); // Must handle here
  }
}, 100);
```

### Throwing Methods
- `_.template()` can throw SyntaxError on invalid template strings
- Most lodash methods do not throw, but `_.template()` is an exception

Reference: Official API documentation for _.template().

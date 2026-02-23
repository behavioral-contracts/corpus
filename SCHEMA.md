# Behavioral Contract Schema Specification

**Version:** 1.0.0
**Last Updated:** February 2026
**Purpose:** Define the structure for encoding npm package behavioral contracts

---

## Overview

This schema defines how to encode the **documented behavioral contracts** of npm packages in a machine-readable, human-auditable format. Each contract file specifies what a package's functions promise to do, what conditions they expect, and what error states calling code must handle.

**This is not a type system.** This is a behavioral specification layer that sits above types.

---

## Design Principles

1. **Human-readable** — engineers should be able to read and understand contracts without tooling
2. **AI-writable** — LLMs should be able to generate valid contracts from package documentation
3. **Versioned** — contracts track both package semver ranges and their own version
4. **Citeable** — every behavioral claim links to authoritative source documentation
5. **Compilable** — contracts map directly to static analysis rules

---

## File Structure

Each package contract is a YAML file following this structure:

```yaml
package: <string>               # npm package name
semver: <string>                # semver range this contract applies to
contract_version: <string>      # semver version of this contract itself
maintainer: <string>            # GitHub username or team
last_verified: <string>         # ISO date when contract was last verified against docs

functions:
  - name: <string>              # function name
    import_path: <string>       # how this function is imported
    description: <string>       # human-readable description

    preconditions: []           # what callers must ensure BEFORE calling
    postconditions: []          # what happens AFTER the call (returns/throws)
    edge_cases: []              # known sharp edges and gotchas
```

---

## Preconditions

Preconditions describe what the **caller** must ensure before invoking the function.

```yaml
preconditions:
  - id: <string>                # unique identifier within this function
    description: <string>       # what must be true before calling
    source: <url>               # documentation link supporting this claim
    severity: <error|warning|info>  # how critical is this precondition
```

**Example:**
```yaml
preconditions:
  - id: absolute-url
    description: "URL must be absolute in Node.js environments"
    source: "https://axios-http.com/docs/req_config"
    severity: warning
```

**Severity guidance:**
- `error`: Violating this causes incorrect behavior or security issues
- `warning`: Violating this causes surprising behavior but may work in some contexts
- `info`: Best practice suggestion, not a correctness issue

---

## Postconditions

Postconditions describe the **outcomes** of calling the function — what it returns or throws.

```yaml
postconditions:
  - id: <string>                # unique identifier
    condition: <string>         # when does this outcome occur
    returns: <string>           # what is returned (if applicable)
    throws: <string>            # what error is thrown (if applicable)
    required_handling: <string> # what the caller MUST do to handle this case
    source: <url>               # documentation link
    severity: <error|warning|info>
```

**Example:**
```yaml
postconditions:
  - id: rate-limited-429
    condition: "response status is 429"
    throws: "AxiosError with response.status === 429"
    required_handling: >
      Caller MUST either implement retry logic with backoff
      OR explicitly handle 429 as a terminal error.
      Silently ignoring 429 is a violation.
    source: "https://axios-http.com/docs/handling_errors"
    severity: error
```

### Required Handling

The `required_handling` field is **the most important part of the contract**. It specifies what the static analyzer will check for.

**What counts as handling:**
- A catch block that inspects the specific error condition (not just logs generically)
- A conditional check on the result before using it
- Explicit retry logic with backoff
- Propagating the error with additional context

**What does NOT count as handling:**
- Bare `catch(e) { console.log(e) }` — this is swallowing, not handling
- Bare `catch(e) { throw e }` — this is rethrowing without adding value
- Using result without null check when null is a documented outcome

---

## Edge Cases

Edge cases document **known sharp edges** that aren't errors but are surprising enough to warrant explicit documentation.

```yaml
edge_cases:
  - id: <string>
    description: <string>       # what the edge case is
    source: <url>               # documentation or GitHub issue link
    severity: <warning|info>    # edge cases are never "error" severity
```

**Example:**
```yaml
edge_cases:
  - id: timeout-default
    description: "Default timeout is 0 (no timeout). Applications should set explicit timeouts."
    source: "https://axios-http.com/docs/req_config"
    severity: info
```

---

## Complete Example: axios

```yaml
package: axios
semver: ">=1.0.0 <2.0.0"
contract_version: "1.0.0"
maintainer: "corpus-team"
last_verified: "2026-02-01"

functions:
  - name: get
    import_path: "axios"
    description: "Makes an HTTP GET request"

    preconditions:
      - id: absolute-url
        description: "URL must be absolute in Node.js environments"
        source: "https://axios-http.com/docs/req_config"
        severity: warning

    postconditions:
      - id: success-2xx
        condition: "response status is 2xx"
        returns: "AxiosResponse object with data, status, headers fields"
        source: "https://axios-http.com/docs/res_schema"
        severity: info

      - id: error-4xx-5xx
        condition: "response status is 4xx or 5xx"
        throws: "AxiosError"
        required_handling: "catch AxiosError and inspect error.response.status"
        source: "https://axios-http.com/docs/handling_errors"
        severity: error

      - id: rate-limited-429
        condition: "response status is 429"
        throws: "AxiosError with response.status === 429"
        required_handling: >
          Caller MUST either implement retry logic with backoff
          OR explicitly handle 429 as a terminal error.
          Silently ignoring 429 is a violation.
        source: "https://axios-http.com/docs/handling_errors"
        severity: error

      - id: network-failure
        condition: "network error, timeout, or DNS failure"
        throws: "AxiosError with no response property (error.response is undefined)"
        required_handling: "catch block must handle case where error.response is undefined"
        source: "https://axios-http.com/docs/handling_errors"
        severity: error

    edge_cases:
      - id: relative-url-node
        description: "Relative URLs throw in Node.js environments"
        source: "https://github.com/axios/axios/issues/1212"
        severity: warning

      - id: timeout-default
        description: "Default timeout is 0 (no timeout). Applications should set explicit timeouts."
        source: "https://axios-http.com/docs/req_config"
        severity: info
```

---

## Validation Rules

All contract YAML files MUST:
1. Validate against the JSON Schema at `schema/contract.schema.json`
2. Use valid semver in the `semver` and `contract_version` fields
3. Provide working HTTPS URLs in all `source` fields
4. Use only allowed severity values: `error`, `warning`, `info`
5. Include `required_handling` for all `severity: error` postconditions

---

## Contributing Contracts

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- How to research package documentation
- How to verify behavioral claims
- How to write required_handling specifications
- How to test contracts against real code

---

## Maintenance and Versioning

### When to bump contract_version

- **Major (1.0.0 → 2.0.0)**: Breaking change to what is considered a violation
- **Minor (1.0.0 → 1.1.0)**: New postconditions or preconditions added
- **Patch (1.0.0 → 1.0.1)**: Clarifications, typo fixes, source link updates

### When to create a new contract file

When the package releases a new major version with breaking behavioral changes, create a new contract file:
- `packages/axios/contract-v1.yaml` for axios 1.x
- `packages/axios/contract-v2.yaml` for axios 2.x

### Deprecation

To deprecate a contract, add:
```yaml
deprecated: true
deprecated_reason: "Package is no longer maintained"
deprecated_date: "2026-03-01"
```

---

## FAQ

### How is this different from TypeScript types?

TypeScript types specify **structural contracts** (what shape does data have?).
Behavioral contracts specify **semantic contracts** (what does this function promise to do?).

Example: `Promise<Response>` says the type. "Throws on 429 and you must handle it" is the behavioral contract.

### How is this different from JSDoc?

JSDoc is **documentation**. This is **executable specification**. The contract is compiled into static analysis rules that run in CI.

### What if the package documentation is wrong?

The `source` field creates an audit trail. If the docs are wrong, fix the contract and update `last_verified`. The contract represents the **documented behavior**, not necessarily the **actual implementation**.

### What about undocumented behavior?

Only encode **documented** behavioral contracts. If a package has undocumented behavior that users rely on, file an issue with the package to document it, then encode it.

---

## License

This schema specification is licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

Anyone may use, adapt, and share this schema with attribution.

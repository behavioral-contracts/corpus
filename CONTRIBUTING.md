# Contributing to the Behavioral Contracts Corpus

Thank you for helping build the definitive library of npm package behavioral contracts.

This corpus is designed to become the **standard reference** for what npm packages promise to do. Your contributions make TypeScript codebases more auditable and AI-generated code more trustworthy.

---

## What We're Building

Each package in this corpus has a `contract.yaml` file that encodes:
- What functions promise to do
- What error states they can enter
- What calling code MUST do to handle those states correctly

This is **not** a type library. This is a **behavioral specification library**.

TypeScript types say: "this returns a Promise."
Behavioral contracts say: "this throws on 429 and you must handle it."

---

## How to Contribute

### 1. Choose a Package

**Priority packages** (these have the most TypeScript usage):
- [ ] express
- [ ] mongoose
- [ ] redis
- [ ] aws-sdk / @aws-sdk/*
- [ ] pg (PostgreSQL client)
- [ ] kafkajs
- [ ] @octokit/rest
- [ ] nodemailer
- [ ] sharp
- [ ] pdfkit

**Already covered:**
- axios (reference implementation)
- jsonwebtoken
- prisma
- stripe
- bullmq

### 2. Research the Package

Read the **official documentation** thoroughly:
- API reference
- Error handling guide
- Known issues / FAQ
- GitHub issues tagged "bug" or "breaking-change"

**What to look for:**
- Error types the package throws
- Conditions that cause errors (rate limits, network failures, invalid input)
- Return values that can be null/undefined
- Edge cases explicitly called out in docs
- Security-sensitive operations (auth, tokens, webhooks)

### 3. Encode the Contract

Create `packages/<package-name>/contract.yaml` following [SCHEMA.md](./SCHEMA.md).

**Critical rules:**
1. Every behavioral claim MUST link to authoritative documentation in the `source` field
2. Every `severity: error` postcondition MUST include `required_handling`
3. Only encode **documented** behavior, not undocumented quirks
4. Use `severity: error` only for conditions that cause incorrect behavior if unhandled

### 4. Document Your Sources

Create `packages/<package-name>/SOURCES.md` with:
- Links to all documentation you consulted
- CVEs or security advisories (if applicable)
- GitHub issues that document behavioral edge cases
- Date you last verified the contract against current docs

### 5. Test Against Real Code

Before submitting, search GitHub for TypeScript projects using the package:

```bash
site:github.com "<package-name>" language:TypeScript stars:>100
```

Review 3-5 real codebases to verify:
- Your contract catches REAL violations that exist in production code
- Your contract does NOT produce false positives on correct code

### 6. Submit a Pull Request

Title: `Add contract for <package-name>`

Include in PR description:
- Why this package matters (usage stats, security sensitivity, etc.)
- Summary of key error states covered
- Links to 2-3 real codebases you tested against
- Any edge cases you chose NOT to encode (and why)

---

## Writing Good Contracts

### What Makes a Good `required_handling` Specification?

**Good:**
```yaml
required_handling: >
  Caller MUST check if error.response exists before accessing error.response.status.
  Bare catch blocks that log generically do NOT satisfy this requirement.
```

**Bad:**
```yaml
required_handling: "Handle errors properly"
```

The `required_handling` field is compiled into static analysis rules. Be specific about what the code must do.

### When to Use Each Severity Level

**`error`**: Violating this causes:
- Incorrect application behavior (data loss, corruption)
- Security vulnerabilities (auth bypass, injection)
- Unhandled crashes in production

**`warning`**: Violating this causes:
- Surprising behavior that works in some contexts but not others
- Performance issues
- API misuse that doesn't cause immediate errors

**`info`**: Best practices that:
- Improve code quality but aren't correctness issues
- Are stylistic preferences
- Document unusual behaviors developers should know

### Real-World Examples

#### ❌ Too Vague
```yaml
- id: error-handling
  condition: "function throws errors"
  throws: "Error"
  required_handling: "catch errors"
  severity: error
```

**Problem:** Not specific enough. What KIND of errors? When? What must the catch block DO?

#### ✅ Specific and Actionable
```yaml
- id: rate-limited-429
  condition: "response status is 429"
  throws: "AxiosError with response.status === 429"
  required_handling: >
    Caller MUST either:
    1. Implement exponential backoff retry logic, OR
    2. Explicitly handle 429 as a terminal error and surface to user
    Silently catching and ignoring 429 is a violation.
  source: "https://axios-http.com/docs/handling_errors"
  severity: error
```

**Why this works:** Specific condition, specific error type, specific handling options, explains why it matters.

---

## Quality Standards

Every contract MUST:
1. ✅ Validate against `schema/contract.schema.json`
2. ✅ Include working HTTPS URLs in all `source` fields
3. ✅ Be verified against the package's official docs within the last 90 days
4. ✅ Produce zero false positives on correct usage patterns
5. ✅ Catch at least one real violation in open-source code

---

## Review Process

Maintainers will check:
1. **Accuracy**: Does the contract match current package documentation?
2. **Precision**: Does it produce false positives?
3. **Coverage**: Does it catch the MOST COMMON misuse patterns?
4. **Sources**: Are all claims backed by authoritative docs?
5. **Testability**: Can the contract be compiled to static analysis rules?

---

## Maintenance

### Updating Existing Contracts

When a package releases a new version with behavioral changes:

1. **Patch updates** (1.6.2 → 1.6.3): Usually no contract changes needed
2. **Minor updates** (1.6.0 → 1.7.0): May add new postconditions; bump contract `contract_version` minor
3. **Major updates** (1.0.0 → 2.0.0): May require new contract file or breaking changes; bump contract `contract_version` major

### Deprecating Contracts

If a package is no longer maintained or the contract is obsolete:

```yaml
deprecated: true
deprecated_reason: "Package reached end of life"
deprecated_date: "2026-03-01"
```

---

## Community Principles

This corpus is built on:
- **Accuracy over coverage** — 10 perfect contracts beat 100 noisy ones
- **Documentation, not opinion** — encode what the docs say, not what you wish they said
- **No vendor lock-in** — contracts are CC BY 4.0, anyone can use them
- **Collaboration** — if you disagree with a contract, open an issue to discuss

---

## Getting Help

- **Questions about the schema**: Open an issue with label `schema-question`
- **Questions about a specific package**: Open an issue with label `package:<name>`
- **Unsure if something belongs**: Open an issue with label `discussion`

---

## License

All contributions to this corpus are licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

By submitting a pull request, you agree to license your contribution under CC BY 4.0.

---

## Recognition

Contributors are credited in:
- The `maintainer` field of contracts they create
- The quarterly contributor list in the README
- Citations when contracts are used in published research or tooling

Thank you for helping make TypeScript codebases more auditable.

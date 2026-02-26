# Behavioral Contracts: Design Rationale

**Purpose:** Explain why behavioral contracts exist, why this schema design, and what gap they fill that API specs and tests don't cover.

**Last Updated:** 2026-02-26

---

## The Problem: Missing Error Handling Detection Gap

### What Existing Tools Don't Catch

**1. API Specifications (OpenAPI, GraphQL schemas)**
- ✅ **What they do well:** Document API structure, types, endpoints
- ❌ **What they miss:** Runtime error handling requirements
- ❌ **Example gap:**
  ```typescript
  // OpenAPI knows this endpoint exists:
  POST /api/payments

  // But doesn't know you MUST handle these errors:
  try {
    await stripe.charges.create(...)
  } catch (error) {
    if (error.type === 'card_error') { /* Handle card errors */ }
    if (error.type === 'rate_limit_error') { /* Handle rate limits */ }
  }
  ```

**2. TypeScript Type Definitions (.d.ts files)**
- ✅ **What they do well:** Type safety, autocomplete, compile-time checks
- ❌ **What they miss:** Which errors can be thrown, what handling is required
- ❌ **Example gap:**
  ```typescript
  // TypeScript knows the signature:
  function verifyIdToken(token: string): Promise<DecodedIdToken>

  // But doesn't know you MUST wrap in try-catch:
  // ❌ Missing error handling - TypeScript doesn't warn
  const decoded = await admin.auth().verifyIdToken(token);
  ```

**3. Unit Tests**
- ✅ **What they do well:** Verify specific behaviors, catch regressions
- ❌ **What they miss:** Incomplete coverage, don't enforce patterns project-wide
- ❌ **Example gap:**
  ```typescript
  // Tests might verify happy path:
  it('creates payment successfully', async () => {
    const payment = await stripe.charges.create(validData);
    expect(payment.status).toBe('succeeded');
  });

  // But miss the error handling test:
  // ❌ This test doesn't exist in many codebases
  it('handles card errors', async () => {
    try {
      await stripe.charges.create(invalidCard);
    } catch (error) {
      expect(error.type).toBe('card_error');
    }
  });
  ```

**4. Integration Tests**
- ✅ **What they do well:** Verify end-to-end flows work
- ❌ **What they miss:** Don't test error paths systematically
- ❌ **Example gap:**
  ```typescript
  // Integration test verifies:
  POST /checkout → 200 OK

  // But doesn't verify error handling for:
  // - Network timeouts
  // - API rate limits
  // - Invalid API keys
  // - Declined cards
  ```

**5. Linters (ESLint, TSLint)**
- ✅ **What they do well:** Enforce code style, catch basic issues
- ❌ **What they miss:** Package-specific error handling requirements
- ❌ **Example gap:**
  ```typescript
  // ESLint can enforce:
  "no-undef": "error"
  "no-unused-vars": "error"

  // But can't enforce:
  "axios-must-have-try-catch": "error"
  "stripe-must-check-error-type": "error"
  ```

---

## The Solution: Behavioral Contracts

### What Behavioral Contracts Provide

**Behavioral contracts document RUNTIME BEHAVIOR requirements that other tools miss:**

1. **Which errors CAN be thrown** (not in type definitions)
2. **Which errors MUST be handled** (not in API specs)
3. **How to handle them properly** (not in documentation)
4. **Package-specific patterns** (not in generic linters)

### Example: Stripe Payment Handling

**API Spec says:**
```yaml
POST /v1/charges
  parameters:
    - amount: integer
    - currency: string
  responses:
    200: Charge object
    400: Error object
```

**TypeScript says:**
```typescript
function create(params: ChargeCreateParams): Promise<Charge>
```

**Tests verify:**
```typescript
it('creates charge', async () => {
  const charge = await stripe.charges.create({ amount: 1000, currency: 'usd' });
  expect(charge).toBeDefined();
});
```

**Behavioral Contract says:**
```yaml
functions:
  - name: charges.create
    postconditions:
      - condition: must_handle_error
        required_handling: try_catch
        severity: ERROR
        throws:
          - type: card_error
            message: "Card declined, insufficient funds, etc."

      - condition: must_handle_error
        required_handling: try_catch
        severity: ERROR
        throws:
          - type: rate_limit_error
            message: "Too many requests to Stripe API"
```

**This enables:**
```typescript
// ✅ Analyzer can now detect:
await stripe.charges.create(...);  // ❌ ERROR: Missing try-catch

// ✅ Analyzer can verify:
try {
  await stripe.charges.create(...);
} catch (error) {
  // ✅ GOOD: Error handling present
}
```

---

## Schema Design Decisions

### Why This Structure?

Our schema is designed to answer these questions:

1. **"What can go wrong?"** → `throws` / `returns` fields
2. **"How must I handle it?"** → `required_handling` field
3. **"How important is this?"** → `severity` field
4. **"Why is this required?"** → `rationale` field
5. **"Where's the proof?"** → `source` field

### Field-by-Field Justification

#### 1. `package` + `semver`

**Why:** Package versions have different behaviors
**Example:**
```yaml
package: stripe
semver: ">=8.0.0 <15.0.0"
```

**Justification:**
- Stripe v8 introduced new error types
- Stripe v15 might have breaking changes
- Contracts must version-lock to ensure accuracy

#### 2. `functions` (array of function definitions)

**Why:** Different functions have different error behaviors
**Example:**
```yaml
functions:
  - name: charges.create     # Can throw card_error
  - name: customers.list     # Cannot throw card_error (read-only)
```

**Justification:**
- Write operations (create, update) have different errors than reads
- Each function needs its own behavior specification

#### 3. `postconditions` (array of requirements)

**Why:** One function can have multiple error handling requirements
**Example:**
```yaml
functions:
  - name: charges.create
    postconditions:
      - condition: must_handle_error    # Card errors
        throws:
          - type: card_error

      - condition: must_handle_error    # Network errors
        throws:
          - type: api_connection_error

      - condition: must_handle_error    # Rate limits
        throws:
          - type: rate_limit_error
```

**Justification:**
- Payment endpoints need card error handling
- ALL endpoints need network error handling
- High-traffic endpoints need rate limit handling
- Each requirement is independent and must be verified separately

#### 4. `condition` field

**Why:** Different types of behavioral requirements
**Options:**
- `must_handle_error` - Must wrap in try-catch
- `must_check_result` - Must validate return value
- `must_use_specific_handler` - Must use package-specific error checking

**Example:**
```yaml
# Axios example:
condition: must_use_specific_handler
required_handling: axios_is_axios_error
```

**Justification:**
- Some packages have generic errors (use try-catch)
- Some packages have specific error checkers (use `axios.isAxiosError()`)
- Different conditions require different validation logic

#### 5. `required_handling` field

**Why:** Specify HOW to handle the error
**Options:**
- `try_catch` - Generic try-catch block
- `axios_is_axios_error` - Axios-specific handler
- `prisma_known_request_error` - Prisma-specific handler
- `check_http_status` - HTTP status code check

**Example:**
```yaml
# Generic handling:
required_handling: try_catch

# Package-specific handling:
required_handling: axios_is_axios_error

# Return value checking:
required_handling: check_http_status
```

**Justification:**
- Different packages have different best practices
- Some have helper functions (axios.isAxiosError)
- Some require specific error type checks (Prisma)
- Analyzer must know which pattern to look for

#### 6. `severity` field

**Why:** Differentiate critical vs optional error handling
**Options:**
- `ERROR` - Must fix (blocks production)
- `WARNING` - Should fix (good practice)
- `INFO` - Nice to have (informational)

**Example:**
```yaml
# Critical: Financial transactions
severity: ERROR
throws:
  - type: card_error

# Important: User-facing operations
severity: WARNING
throws:
  - type: validation_error

# Informational: Logging
severity: INFO
```

**Justification:**
- Not all errors are equally important
- Some errors crash the app (ERROR)
- Some just need logging (WARNING/INFO)
- Developers can prioritize fixes based on severity

#### 7. `throws` / `returns` fields

**Why:** Document what can go wrong
**Example:**
```yaml
throws:
  - type: card_error
    message: "Card was declined"
    codes: ["card_declined", "insufficient_funds"]
```

**Justification:**
- Developers need to know WHAT errors are possible
- Error messages help with debugging
- Error codes enable specific handling
- This information is NOT in type definitions

#### 8. `rationale` field

**Why:** Explain WHY this handling is required
**Example:**
```yaml
rationale: "Payment failures must be handled to prevent incomplete transactions and provide user feedback"
```

**Justification:**
- Helps developers understand importance
- Provides context for code reviews
- Documents business requirements
- Prevents "why is this here?" questions

#### 9. `source` field

**Why:** Provide proof for the requirement
**Example:**
```yaml
source: "https://stripe.com/docs/error-handling"
```

**Justification:**
- Contracts must be verifiable
- Developers can read official documentation
- Enables independent verification
- Builds trust in the contract

---

## What Gap Do Behavioral Contracts Fill?

### Comparison Table

| Tool | What It Does | What It Misses | Behavioral Contract Fills |
|------|--------------|----------------|---------------------------|
| **API Specs** | Document endpoints, request/response shapes | Runtime error requirements, error types, handling patterns | ✅ Documents throws/returns, required handling |
| **Type Definitions** | Type safety, compile-time checks | Runtime errors, error handling requirements | ✅ Documents error types, handling patterns |
| **Unit Tests** | Verify specific behaviors | Incomplete coverage, don't enforce project-wide | ✅ Enforces patterns across entire codebase |
| **Integration Tests** | Verify end-to-end flows | Don't systematically test error paths | ✅ Detects ALL missing error handlers |
| **Linters** | Enforce code style | Package-specific error handling | ✅ Package-specific behavioral rules |
| **Documentation** | Explains how to use packages | Not machine-readable, not enforced | ✅ Machine-readable, analyzer-enforced |

### Real-World Example: The Gap in Practice

**Scenario:** Junior developer adds Stripe payment processing

**Without Behavioral Contracts:**
```typescript
// Developer writes this (looks fine):
async function processPayment(amount: number) {
  const charge = await stripe.charges.create({
    amount,
    currency: 'usd',
    source: 'tok_visa'
  });
  return charge;
}

// Problems:
// ❌ No error handling
// ❌ TypeScript doesn't warn
// ❌ ESLint doesn't warn
// ❌ Tests pass (happy path only)
// ❌ Code review might miss it

// Production:
// 💥 Card declined → Unhandled exception → App crashes
// 💥 Network timeout → Unhandled exception → App crashes
// 💥 Rate limit → Unhandled exception → App crashes
```

**With Behavioral Contracts:**
```typescript
// Developer writes this:
async function processPayment(amount: number) {
  const charge = await stripe.charges.create({
    amount,
    currency: 'usd',
    source: 'tok_visa'
  });
  return charge;
}

// Analyzer runs:
// ❌ ERROR: stripe.charges.create() missing error handling
// Location: payment.ts:12
// Required: try-catch with card_error, rate_limit_error handling
// Severity: ERROR
// Source: https://stripe.com/docs/error-handling

// Developer fixes:
async function processPayment(amount: number) {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      source: 'tok_visa'
    });
    return charge;
  } catch (error) {
    if (error.type === 'card_error') {
      // Handle declined cards
      throw new PaymentError('Card declined', error);
    }
    if (error.type === 'rate_limit_error') {
      // Handle rate limits
      throw new PaymentError('Too many requests', error);
    }
    throw error;
  }
}

// Analyzer runs:
// ✅ PASS: All error handling present

// Production:
// ✅ Card declined → Graceful error → User sees message
// ✅ Network timeout → Graceful error → User sees message
// ✅ Rate limit → Graceful error → Retry logic kicks in
```

---

## Why Not Just Use Existing Tools?

### Why Not Just Improve TypeScript Types?

**Limitation:** TypeScript doesn't support exception specifications
```typescript
// This doesn't exist in TypeScript:
function create(params: Params): Promise<Charge> throws CardError, NetworkError

// TypeScript only knows:
function create(params: Params): Promise<Charge>  // Any error possible
```

**Why we can't wait:** TypeScript exception types are years away (if ever)

### Why Not Just Write Better Tests?

**Limitation:** Tests don't enforce patterns project-wide
```typescript
// Test file: stripe.test.ts
it('handles errors', async () => {
  try {
    await stripe.charges.create(badData);
  } catch (error) {
    expect(error.type).toBe('card_error');
  }
});

// ❌ But this doesn't prevent:
// payment-service.ts - Missing error handling
// checkout-flow.ts - Missing error handling
// subscription-logic.ts - Missing error handling
```

**Behavioral contracts:** Enforce pattern across ALL files, not just test files

### Why Not Just Read Documentation?

**Limitation:** Documentation is not enforced
```typescript
// Documentation says:
"Remember to handle card errors!"

// Developer reads it: "Yeah yeah, I'll remember"

// 3 months later:
await stripe.charges.create(...);  // ❌ Forgot to add try-catch

// Code review: ✅ Approved (reviewer also forgot)

// Production: 💥 Crashes
```

**Behavioral contracts:** Automated enforcement, can't forget

### Why Not Just Use ESLint?

**Limitation:** ESLint can't know package-specific requirements
```typescript
// ESLint can enforce:
"no-await-in-loop": "error"        // Generic rule
"no-console": "warn"               // Generic rule

// ESLint can't enforce (without our analyzer):
"stripe-charges-must-have-error-handling": "error"    // Package-specific
"axios-must-use-isAxiosError": "error"                // Package-specific
"prisma-must-handle-known-errors": "error"            // Package-specific
```

**Behavioral contracts:** Package-specific behavioral rules

---

## Design Principles

### 1. Machine-Readable + Human-Readable

**Principle:** Contracts must be parseable by analyzers AND readable by developers

**How we achieve it:**
- YAML format (human-friendly)
- Clear field names (`throws`, `required_handling`, `severity`)
- Inline documentation via `rationale` and `source`

**Example:**
```yaml
# Machine can parse this:
functions:
  - name: charges.create
    postconditions:
      - condition: must_handle_error
        severity: ERROR

# Human can read this:
    postconditions:
      - condition: must_handle_error
        rationale: "Payment failures must be handled to prevent incomplete transactions"
        source: "https://stripe.com/docs/error-handling"
```

### 2. Source-Backed

**Principle:** Every requirement must have proof

**How we enforce it:**
- `source` field is required
- Sources are verified URLs (not "trust me bro")
- Multiple sources for cross-verification

**Example:**
```yaml
source: "https://docs.stripe.com/error-handling#card-errors"
```

### 3. Versioned

**Principle:** Contracts evolve with package versions

**How we version:**
- `semver` field locks contract to package versions
- Different contracts for major versions
- Contracts update when package behavior changes

**Example:**
```yaml
# Stripe v8-14:
package: stripe
semver: ">=8.0.0 <15.0.0"

# Stripe v15+ (if breaking changes):
package: stripe
semver: ">=15.0.0"
```

### 4. Actionable

**Principle:** Violations must be fixable

**How we make it actionable:**
- Clear error messages
- Specific location (file:line)
- Suggested fix in violation message
- Link to documentation

**Example:**
```
❌ ERROR: Missing error handling

Location: payment.ts:42
Function: stripe.charges.create()
Required: try-catch with card_error handling
Severity: ERROR

Suggested fix:
  try {
    await stripe.charges.create(...)
  } catch (error) {
    if (error.type === 'card_error') {
      // Handle card errors
    }
  }

Source: https://stripe.com/docs/error-handling
```

### 5. Minimal False Positives

**Principle:** High precision (>80% true positives, <20% false positives)

**How we achieve it:**
- Detailed pattern matching (not just "look for try-catch")
- Instance tracking (detect `const client = new Stripe()`)
- Context-aware (knows the difference between `user.create` and `prisma.user.create`)
- Continuous refinement based on real-world testing

---

## Success Metrics

### What Success Looks Like

**Quantitative:**
- ✅ >80% true positive rate
- ✅ <20% false positive rate
- ✅ Detect 100% of missing error handlers (in test fixtures)
- ✅ Zero false negatives (in test fixtures)

**Qualitative:**
- ✅ Developers trust the analyzer
- ✅ Violations are actionable (clear fixes)
- ✅ Contracts are maintainable (easy to update)
- ✅ Package maintainers can contribute

### What Failure Looks Like

**Quantitative:**
- ❌ <60% true positive rate (too many false positives)
- ❌ >40% false positive rate (noise, developers ignore)
- ❌ <80% detection rate (misses real issues)

**Qualitative:**
- ❌ Developers disable the analyzer (too noisy)
- ❌ Violations are unclear (can't fix)
- ❌ Contracts rot (not maintained)

---

## Comparison to Alternative Approaches

### Approach 1: Extend TypeScript Types

**Pros:**
- Native language support
- IDE integration
- Compile-time checks

**Cons:**
- ❌ TypeScript doesn't support exception types
- ❌ Would require language-level changes
- ❌ Years away (if ever)
- ❌ Not backwards compatible

**Verdict:** Good long-term, but not viable today

### Approach 2: Custom ESLint Rules

**Pros:**
- Familiar tooling
- Existing infrastructure
- IDE support

**Cons:**
- ❌ Can't scale to 100+ packages (one rule per package?)
- ❌ Hard to share/distribute contracts
- ❌ No versioning support
- ❌ Not structured (just code)

**Verdict:** Good for custom rules, bad for package contracts

### Approach 3: Documentation Comments

**Pros:**
- Close to code
- Easy to write
- Human-readable

**Cons:**
- ❌ Not machine-readable
- ❌ Not enforced
- ❌ Gets out of sync with code
- ❌ No versioning

**Verdict:** Good for documentation, bad for enforcement

### Approach 4: Behavioral Contracts (Our Approach)

**Pros:**
- ✅ Machine-readable (YAML)
- ✅ Human-readable (clear fields)
- ✅ Versioned (semver field)
- ✅ Source-backed (proof required)
- ✅ Scalable (one contract per package)
- ✅ Distributable (corpus repo)
- ✅ Enforceable (analyzer)

**Cons:**
- ⚠️ New concept (learning curve)
- ⚠️ Requires maintenance (contracts must be updated)
- ⚠️ Corpus must be built (initial investment)

**Verdict:** Best fit for the problem

---

## Conclusion

**Behavioral contracts fill a critical gap:**

| What They Provide | Why It Matters |
|-------------------|----------------|
| Runtime error documentation | TypeScript types don't cover this |
| Machine-readable requirements | Documentation is not enforced |
| Package-specific rules | Generic linters can't know this |
| Version-locked specifications | Package behavior changes over time |
| Source-backed proof | Trust but verify |
| Automated enforcement | Humans forget, analyzers don't |

**Without behavioral contracts:**
- Developers rely on memory and docs (unreliable)
- Error handling is inconsistent (depends on who wrote it)
- Production bugs from missing error handling (crashes, data loss)
- No way to enforce best practices project-wide

**With behavioral contracts:**
- Machine-readable requirements (analyzers can enforce)
- Consistent error handling (enforced patterns)
- Catch errors before production (CI/CD integration)
- Knowledge base of package behaviors (corpus)

**The schema design supports this by:**
1. Being machine-readable (YAML)
2. Being human-readable (clear fields, rationale)
3. Being source-backed (verifiable)
4. Being versioned (evolves with packages)
5. Being actionable (specific fixes)

**Result:** A new class of tooling that bridges the gap between documentation and enforcement, catching errors that type systems, tests, and linters miss.

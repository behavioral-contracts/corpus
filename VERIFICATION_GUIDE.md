# Verification Guide

**How to verify behavioral contracts are accurate and complete**

This guide is for contract contributors and maintainers who need to ensure contracts correctly represent package behavior.

---

## Overview

A behavioral contract is only useful if it's **accurate**. This guide shows you how to verify:

1. Contract completeness (all critical behaviors covered)
2. Contract accuracy (claims match reality)
3. Detection effectiveness (analyzer catches violations)
4. Zero false positives (no incorrect flagging)

---

## Step 1: Contract Structure Validation

### Automated Validation

Run the validation script:

```bash
./tools/validate-package.sh <package-name>
```

**10 validation checks:**
1. ✅ Package directory exists
2. ✅ contract.yaml exists
3. ✅ contract.yaml structure valid
4. ✅ Functions defined
5. ✅ SOURCES.md exists
6. ✅ SOURCES.md complete (no TODOs)
7. ✅ fixtures/ directory exists
8. ✅ Required fixtures present
9. ✅ Optional fixtures present
10. ✅ tsconfig.json properly formatted

**All checks must pass before proceeding.**

---

### Manual Structure Review

**Check contract.yaml fields:**

```yaml
package: axios                    # ✅ Package name
semver: ^1.0.0                    # ✅ Supported versions
contract_version: "1.0.0"         # ✅ Contract version
maintainer: "corpus-team"         # ✅ Maintainer
last_verified: "2026-02-25"       # ✅ Verification date

detection:
  type_names:                     # ✅ Type-aware detection
    - AxiosInstance
    - AxiosResponse

functions:                        # ✅ Functions array
  - name: get
    import_path: "axios"
    description: "..."
    postconditions:               # ✅ Postconditions defined
      - id: axios-get-no-error-handling
        description: "..."
        severity: error
        rationale: "..."
        source: "https://..."     # ✅ Source URL
```

**Required fields:**
- `package`, `semver`, `contract_version`
- `detection.type_names` (for 96% accuracy)
- `functions` array with at least 1 function
- Each function has `postconditions`
- Each postcondition has `severity`, `rationale`, `source`

---

## Step 2: Documentation Verification

### SOURCES.md Completeness

Check that SOURCES.md includes:

1. **Official Documentation Links**
   - Main package docs
   - API reference
   - Error handling guide

2. **Behavioral Requirements**
   - What errors can occur
   - What conditions must be met
   - What calling code must do

3. **Contract Rationale**
   - Why these behaviors matter
   - What goes wrong if violated
   - Real-world impact

4. **CVE Analysis** (if applicable)
   - Known security issues
   - Behavioral patterns to avoid

**Example (axios):**
```markdown
## Behavioral Requirements

**Network Errors:** ECONNREFUSED, ETIMEDOUT, socket hang up
**HTTP Errors:** 4xx, 5xx status codes
**Must wrap axios calls in try-catch for error handling**
**Must check for axios.isAxiosError() to handle network vs app errors**

## Contract Rationale

**Network failures are common:** DNS, timeouts, connection refused
**HTTP errors vary:** 401 auth, 404 not found, 429 rate limit, 500 server error
**Uncaught errors crash applications** → 500 responses to users
```

---

### Cross-Reference with Official Docs

**Verify every claim against official documentation:**

1. Open package docs (from SOURCES.md links)
2. Search for error handling section
3. Confirm contract claims match docs
4. Document any gaps or ambiguities

**Red flags:**
- ❌ No source URL for postcondition
- ❌ Claim contradicts official docs
- ❌ Outdated docs (package has major version change)

---

## Step 3: Fixture Testing

### Test Fixtures Against Analyzer

**Run analyzer on fixtures:**

```bash
cd verify-cli
npm run build

# Test package fixtures
node dist/index.js \
  --tsconfig ../corpus/packages/<package>/fixtures/tsconfig.json \
  --corpus ../corpus
```

### Expected Results

**proper-error-handling.ts → 0 violations**
```
✅ 0 violations found

All code follows behavioral contracts.
```

If violations found → Contract is too strict or fixture is incorrect.

---

**missing-error-handling.ts → Multiple ERROR violations**
```
❌ Found 5 violations:

ERROR: axios-get-no-error-handling
  Line 12: await axios.get('/api/data')

ERROR: axios-post-no-error-handling
  Line 18: await axios.post('/api/users', data)
...
```

If no violations found → Analyzer not detecting properly (fix analyzer or contract).

---

**instance-usage.ts → Violations where try-catch missing**
```
❌ Found 3 violations:

ERROR: axios-get-no-error-handling
  Line 25: await this.client.get('/data')  (instance method)
...
```

Confirms analyzer detects instance-based usage (critical for 96% accuracy).

---

### Fixture Quality Checklist

- [ ] proper-error-handling.ts has try-catch blocks
- [ ] missing-error-handling.ts has no try-catch
- [ ] instance-usage.ts uses class instances
- [ ] All fixtures compile without errors
- [ ] Fixtures cover key package functions
- [ ] Edge cases included (optional edge-cases.ts)

---

## Step 4: Real Repo Validation

### Test Against Actual Codebases

**Goal:** Verify contracts catch real violations and produce no false positives.

**Process:**

1. **Find repos using the package**
   ```bash
   # Search GitHub for repos
   gh search repos "<package> language:typescript stars:>100"
   ```

2. **Clone and analyze**
   ```bash
   git clone https://github.com/org/repo
   cd repo && npm install

   # Run analyzer
   cd ../verify-cli
   node dist/index.js --tsconfig ../test-repos/repo/tsconfig.json --corpus ../corpus
   ```

3. **Review violations**
   - Are they true positives? (real bugs/issues)
   - Are they false positives? (incorrect flagging)
   - Are violations clear and actionable?

---

### True Positive Examples

**Good violation (axios):**
```typescript
// repo: medusajs/medusa
// file: src/api/routes/admin/products.ts:45

async function fetchProduct(id: string) {
  const response = await axios.get(`/products/${id}`);
  return response.data;
}
```

**Violation:**
```
❌ axios-get-no-error-handling (ERROR)
   src/api/routes/admin/products.ts:45:3
   Missing try-catch around axios.get()
```

**Why it's correct:**
- No try-catch → crashes on network error
- Real bug → should be fixed
- Clear violation → easy to understand

---

### False Positive Examples

**Bad violation (incorrect):**
```typescript
// Framework already catches errors at top level
app.get('/api/data', async (req, res) => {
  const response = await axios.get('/external-api');
  res.json(response.data);
});
```

**Violation:**
```
❌ axios-get-no-error-handling (ERROR)
   src/routes/api.ts:12:5
   Missing try-catch around axios.get()
```

**Why it's a false positive:**
- Express catches async errors (if using async handler wrapper)
- Not a real bug
- Contract should allow framework error handling

**Fix:** Update contract to recognize framework error handlers.

---

### Validation Metrics

**Target metrics:**
- **Precision:** >95% (violations are real issues)
- **Recall:** >90% (catches most violations)
- **False positive rate:** <5%

**Calculate:**
```
Precision = True Positives / (True Positives + False Positives)
Recall = True Positives / (True Positives + False Negatives)
```

**Test against 3-5 real repos to establish metrics.**

---

## Step 5: Regression Testing

### Establish Baseline

**Before adding/changing contracts:**

```bash
./tools/run-regression-tests.sh baseline
```

Creates `verify-cli/test-baselines/BASELINE.json` with current violation counts.

---

### Compare After Changes

**After modifying contract:**

```bash
./tools/run-regression-tests.sh compare
```

**Expected output:**
```
Comparing against baseline (878 violations)...

Current: 878 violations
Baseline: 878 violations

✅ No regressions detected
```

**If violations increase:**
```
Comparing against baseline (878 violations)...

Current: 952 violations (+74)
Baseline: 878 violations

❌ Regressions detected: +74 violations

New violations in:
- axios: +30
- prisma: +20
- stripe: +24
```

**Action:** Investigate why violations increased. Either:
1. Contract is now more strict (intentional)
2. Contract is incorrectly flagging (fix needed)
3. New fixture violations (expected)

---

### Update Baseline (If Intentional)

```bash
./tools/run-regression-tests.sh baseline
```

**Document why in commit message:**
```
Update axios contract to detect nested calls

Added detection for axios calls within utility functions.
This adds 30 new violations to the baseline (expected).

Baseline: 878 → 908 violations
```

---

## Step 6: Type-Aware Detection Testing

### Verify Type Names

**Contract must include type_names:**

```yaml
detection:
  type_names:
    - AxiosInstance
    - AxiosResponse
    - AxiosError
```

**Why:** Type-aware detection is 96% accurate vs 47% with patterns alone.

---

### Test Type Detection

**Create test file:**

```typescript
// test-type-detection.ts
import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: 'https://api.example.com' });
  }

  async fetchData() {
    // Should be detected via type
    const response = await this.client.get('/data');
    return response.data;
  }
}
```

**Run analyzer:**
```bash
node dist/index.js --tsconfig test-type-detection.ts --corpus ../corpus
```

**Expected:**
```
❌ axios-get-no-error-handling (ERROR)
   test-type-detection.ts:11:5
   Missing try-catch around this.client.get()
```

**If not detected:** Type names missing or incorrect in contract.

---

### Common Type Detection Issues

**Issue 1: Missing type names**
```yaml
# ❌ Missing type_names section
detection: {}
```

**Fix:**
```yaml
# ✅ Include type names
detection:
  type_names:
    - AxiosInstance
```

**Issue 2: Incorrect type names**
```yaml
# ❌ Wrong type name
detection:
  type_names:
    - AxiosClient  # No such type
```

**Fix:** Check package TypeScript definitions:
```bash
# Find correct type names
cat node_modules/axios/index.d.ts | grep "export.*interface"
```

---

## Step 7: Contract Review Checklist

Before marking a contract complete:

### Documentation
- [ ] SOURCES.md includes official docs links
- [ ] All postconditions have source URLs
- [ ] Behavioral requirements clearly stated
- [ ] Contract rationale explains "why"
- [ ] CVE analysis included (if applicable)
- [ ] No TODO markers remain

### Structure
- [ ] Passes 10/10 validation checks
- [ ] type_names defined for type-aware detection
- [ ] Functions cover key package operations
- [ ] Postconditions have error/warning severity
- [ ] semver range covers supported versions

### Testing
- [ ] proper-error-handling.ts → 0 violations
- [ ] missing-error-handling.ts → violations found
- [ ] instance-usage.ts → detects instances
- [ ] Tested against 3+ real repos
- [ ] Precision >95%, Recall >90%
- [ ] Zero false positives confirmed

### Quality
- [ ] Claims match official documentation
- [ ] No contradictions with package behavior
- [ ] Clear, actionable violation messages
- [ ] Regression tests pass
- [ ] Baseline updated (if needed)

---

## Common Issues & Solutions

### Issue: Analyzer not detecting violations

**Symptoms:**
- missing-error-handling.ts → 0 violations
- Real repos with obvious bugs → 0 violations

**Causes:**
1. Missing type_names in contract
2. Incorrect function names
3. Analyzer doesn't support pattern yet

**Debug:**
```bash
# Enable debug mode
DEBUG=verify-cli:* node dist/index.js ...
```

**Solutions:**
1. Add type_names to contract
2. Verify function names match package exports
3. Enhance analyzer (see analyzer enhancement guide)

---

### Issue: Too many false positives

**Symptoms:**
- proper-error-handling.ts → violations found
- Real repos with correct code → violations

**Causes:**
1. Contract too strict
2. Framework error handling not recognized
3. Edge cases not handled

**Solutions:**
1. Loosen postcondition requirements
2. Add framework-specific exceptions
3. Update fixtures to cover edge cases

---

### Issue: Violations unclear

**Symptoms:**
- Developers don't understand violation
- Unclear how to fix

**Example:**
```
❌ axios-error (ERROR)
   src/api.ts:12:3
   Error handling required
```

**Better:**
```
❌ axios-get-no-error-handling (ERROR)
   src/api.ts:12:3
   Missing try-catch around axios.get()

   axios.get() can throw network errors (ECONNREFUSED, ETIMEDOUT)
   and HTTP errors (4xx, 5xx). Wrap in try-catch to handle errors.

   See: https://axios-http.com/docs/handling_errors
```

**Solutions:**
1. Use descriptive postcondition IDs
2. Include helpful description text
3. Add links to documentation
4. Provide fix examples in SOURCES.md

---

## Advanced Verification

### CVE Pattern Testing

**If contract prevents CVE:**

1. Create fixture demonstrating vulnerability
2. Verify analyzer flags vulnerable code
3. Document in SOURCES.md

**Example (jsonwebtoken CVE-2015-9235):**

```typescript
// vulnerable-algorithm-confusion.ts
const decoded = jwt.verify(token, publicKey); // ❌ Missing algorithm check
```

**Should trigger:**
```
❌ jwt-algorithm-confusion (ERROR)
   Missing algorithm specification in jwt.verify()
   This is vulnerable to CVE-2015-9235 (algorithm confusion attack)
```

---

### Multi-Version Testing

**If package supports multiple major versions:**

1. Test against each major version
2. Verify contract applies to all versions
3. Document version-specific differences

```yaml
# Supports multiple versions
semver: ^4.0.0 || ^5.0.0

# Document differences in SOURCES.md
```

---

### Performance Testing

**Ensure analyzer performance acceptable:**

```bash
time node dist/index.js --tsconfig large-repo/tsconfig.json --corpus ../corpus
```

**Targets:**
- <10 seconds for 10k LOC
- <60 seconds for 100k LOC

---

## Contributing Verified Contracts

Once verified:

1. **Commit contract**
   ```bash
   cd corpus
   git add packages/<package>/
   git commit -m "Add <package> contract - verified against 5 repos"
   ```

2. **Document verification**
   - Include repos tested
   - Include precision/recall metrics
   - Note any limitations

3. **Submit pull request**
   - Link to verification evidence
   - Describe testing methodology
   - Note any edge cases

---

## Maintenance

### When to Re-verify

- Package releases new major version
- Package changes error handling behavior
- False positives reported by users
- Analyzer enhanced with new capabilities

### Verification Frequency

- **High-use packages (axios, prisma):** Every 6 months
- **Stable packages (express, stripe):** Yearly
- **Niche packages:** As needed

---

## Questions?

- **Verification issues:** Open issue with `verification-question` label
- **False positives:** Open issue with `false-positive` label
- **Contract accuracy:** Open issue with `package:<name>` label

---

**Verified contracts make TypeScript codebases auditable.**

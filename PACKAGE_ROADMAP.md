# Package Contract Roadmap

**Purpose:** Track priority packages for contract creation and their status.

**Last Updated:** 2026-02-25

---

## Current Coverage

- **Total Packages in Corpus:** 13
- **Packages Onboarded:**
  - ✅ @aws-sdk/client-s3
  - ✅ @octokit/rest
  - ✅ @prisma/client
  - ✅ @supabase/supabase-js
  - ✅ @tanstack/react-query
  - ✅ axios
  - ✅ express
  - ✅ mongodb
  - ✅ openai
  - ✅ pg
  - ✅ square
  - ✅ stripe
  - ✅ zod

---

## Priority Queue

### Tier 1: Critical Infrastructure (P0)

#### express
- **Status:** ✅ Complete
- **Priority:** P0 - Critical
- **Usage:** Backend API framework (widely used)
- **Key Behaviors:**
  - Error handling middleware patterns
  - Async route handler errors
  - Request validation failures
  - Response status codes
- **Research:** [docs](https://expressjs.com/en/guide/error-handling.html)
- **Completed:** 2026-02-24
- **Note:** Contract complete, analyzer enhancement needed for callback pattern detection

#### react-hook-form
- **Status:** ✅ Complete
- **Priority:** P0 - Critical
- **Usage:** Form handling (19 files in jake-tennis)
- **Key Behaviors:**
  - Async form submission errors (unhandled promises)
  - Empty catch blocks (silent failures)
  - Server validation errors (missing setError)
  - useFormContext without FormProvider (crashes)
- **Research:** [docs](https://react-hook-form.com/docs)
- **Completed:** 2026-02-24
- **Note:** Contract complete. Analyzer support limited - only detects useFormContext issues. Async error detection and empty catch block detection need analyzer improvements.

#### @tanstack/react-query
- **Status:** ✅ Complete
- **Priority:** P0 - Critical
- **Usage:** Data fetching and caching (jake-tennis: v5.74.3)
- **Key Behaviors:**
  - Query failures and retries
  - Mutation errors
  - Stale data handling
  - Optimistic updates with rollback
- **Research:** [docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- **Completed:** 2026-02-24
- **Note:** Contract complete. Analyzer enhancement needed for hook-based error pattern detection.

#### zod
- **Status:** ✅ Complete
- **Priority:** P0 - Critical
- **Usage:** Schema validation (pairs with react-hook-form, 20+ files in jake-tennis)
- **Key Behaviors:**
  - Schema parsing errors
  - Type coercion failures
  - Custom validator errors
  - Async validation
- **Research:** [docs](https://zod.dev/)
- **Completed:** 2026-02-24
- **Note:** Contract complete with 4 functions (parse, parseAsync, safeParse, safeParseAsync). Analyzer enhancement needed for factory pattern detection. CVE-2023-4316 documented.

#### @aws-sdk/client-s3
- **Status:** ✅ Complete
- **Priority:** P0 - Critical
- **Usage:** AWS S3 cloud storage (widely used in production systems)
- **Key Behaviors:**
  - Object operations (GetObject, PutObject, DeleteObject, HeadObject, CopyObject)
  - Multipart upload error handling and cleanup
  - Bucket operations (CreateBucket, DeleteBucket, HeadBucket)
  - List operations (ListObjectsV2, ListBuckets)
  - Rate limiting (SlowDown 503 errors)
- **Error Types:**
  - NoSuchKey (404) - Object not found
  - NoSuchBucket (404) - Bucket doesn't exist
  - AccessDenied (403) - Permission errors
  - BucketAlreadyExists (409) - Name collision
  - SlowDown (503) - Rate limiting
- **Research:** [AWS SDK v3 docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/)
- **Completed:** 2026-02-25
- **Note:** Contract complete with 2 functions (send, S3Client) and 6 postconditions. Analyzer enhanced with 177 lines of S3Client detection code. Regression tested against 6 packages with 100% backward compatibility. Pattern reusable for all AWS SDK v3 services (DynamoDB, Lambda, SNS, SQS, etc.).

---

### Tier 2: UI & HTTP Libraries (P1)

#### @radix-ui/* (Universal Contract)
- **Status:** 🔴 Not Started
- **Priority:** P1 - High
- **Usage:** 13+ Radix UI components used
- **Strategy:** Create universal contract covering common patterns
- **Key Behaviors:**
  - Component mounting errors
  - Portal rendering issues
  - Accessibility violations
  - State management
- **Packages Covered:**
  - @radix-ui/react-dialog
  - @radix-ui/react-dropdown-menu
  - @radix-ui/react-popover
  - @radix-ui/react-select
  - @radix-ui/react-toast
  - @radix-ui/react-tooltip
  - ... (and 7+ more)
- **Research:** [docs](https://www.radix-ui.com/)
- **Assigned:** Unassigned
- **Target:** Sprint 2

#### node-fetch
- **Status:** 🔴 Not Started
- **Priority:** P1 - High
- **Usage:** HTTP requests (alternative to axios)
- **Key Behaviors:**
  - Network errors
  - Timeout handling
  - Response parsing errors
  - Redirect handling
- **Research:** [docs](https://github.com/node-fetch/node-fetch)
- **Assigned:** Unassigned
- **Target:** Sprint 2

#### cors
- **Status:** 🔴 Not Started
- **Priority:** P1 - High
- **Usage:** Express CORS middleware
- **Key Behaviors:**
  - Origin validation
  - Preflight handling
  - Credential errors
- **Research:** [docs](https://github.com/expressjs/cors)
- **Assigned:** Unassigned
- **Target:** Sprint 2

---

### Tier 3: File Processing (P2)

#### papaparse
- **Status:** 🔴 Not Started
- **Priority:** P2 - Medium
- **Usage:** CSV parsing
- **Key Behaviors:**
  - Parsing errors
  - Encoding issues
  - Large file handling
  - Stream parsing
- **Research:** [docs](https://www.papaparse.com/)
- **Assigned:** Unassigned
- **Target:** Sprint 3

#### xlsx
- **Status:** 🔴 Not Started
- **Priority:** P2 - Medium
- **Usage:** Excel file handling
- **Key Behaviors:**
  - File format errors
  - Sheet access errors
  - Cell type coercion
  - Large file memory issues
- **Research:** [docs](https://docs.sheetjs.com/)
- **Assigned:** Unassigned
- **Target:** Sprint 3

#### mammoth
- **Status:** 🔴 Not Started
- **Priority:** P2 - Medium
- **Usage:** Word document parsing
- **Key Behaviors:**
  - Parse errors
  - Unsupported format handling
  - Image extraction errors
- **Research:** [docs](https://github.com/mwilliamson/mammoth.js)
- **Assigned:** Unassigned
- **Target:** Sprint 3

#### react-pdf
- **Status:** 🔴 Not Started
- **Priority:** P2 - Medium
- **Usage:** PDF rendering
- **Key Behaviors:**
  - Load errors
  - Render failures
  - Page access errors
  - Memory issues with large PDFs
- **Research:** [docs](https://github.com/wojtekmaj/react-pdf)
- **Assigned:** Unassigned
- **Target:** Sprint 3

---

### Tier 4: Utilities & Services (P3)

#### @octokit/rest
- **Status:** ✅ Complete
- **Priority:** P3 - Low
- **Usage:** GitHub REST API client (backstage, prisma, typescript-compiler)
- **Key Behaviors:**
  - API request failures (404, 403, 401, 422)
  - Rate limiting (403 with rate limit headers)
  - Network errors and timeouts
  - Authentication failures
- **Contract Coverage:**
  - 16 GitHub API methods (repos, git, pulls, issues, files)
  - Instance-based detection (new Octokit())
  - 2-level property chains (octokit.repos.get())
  - RequestError with status property
- **Metrics:**
  - True Positive Rate: 100% (26/26 violations in backstage)
  - False Positive Rate: 0%
  - Regression Tests: 3/3 passed
- **Research:** [GitHub Discussions](https://github.com/octokit/octokit.js/discussions/2039)
- **Completed:** 2026-02-25
- **Note:** Full data-driven detection with detection rules in contract.yaml. First package to use new analyzer architecture.

#### puppeteer
- **Status:** 🔴 Not Started
- **Priority:** P3 - Low
- **Usage:** Browser automation
- **Key Behaviors:**
  - Browser launch failures
  - Navigation timeouts
  - Selector not found
  - Screenshot errors
- **Research:** [docs](https://pptr.dev/)
- **Assigned:** Unassigned
- **Target:** Sprint 4

#### date-fns
- **Status:** 🔴 Not Started
- **Priority:** P3 - Low
- **Usage:** Date utilities
- **Key Behaviors:**
  - Invalid date errors
  - Timezone handling
  - Format parsing
- **Research:** [docs](https://date-fns.org/)
- **Assigned:** Unassigned
- **Target:** Sprint 4

#### uuid
- **Status:** 🔴 Not Started
- **Priority:** P3 - Low
- **Usage:** UUID generation
- **Key Behaviors:**
  - Validation errors
  - Version mismatches
- **Research:** [docs](https://github.com/uuidjs/uuid)
- **Assigned:** Unassigned
- **Target:** Sprint 4

#### js-cookie
- **Status:** 🔴 Not Started
- **Priority:** P3 - Low
- **Usage:** Cookie handling
- **Key Behaviors:**
  - Parse errors
  - Invalid cookie names
  - Security attributes
- **Research:** [docs](https://github.com/js-cookie/js-cookie)
- **Assigned:** Unassigned
- **Target:** Sprint 4

---

## Status Legend

- 🔴 **Not Started** - No contract exists
- 🟡 **In Progress** - Contract being researched/written
- 🟢 **Review** - Contract complete, awaiting validation
- ✅ **Complete** - Contract validated and merged
- ⏸️ **Blocked** - Waiting on dependency or decision

---

## Sprint Planning

### Sprint 1 Goals (Tier 1 - P0 Packages)
**Target:** 4 packages → Coverage increase from 1.5% to ~4.5%

- [x] express
- [x] react-hook-form
- [x] @tanstack/react-query
- [x] zod

**Success Criteria:**
- All 4 contracts validated against real codebases
- Zero false positives
- Find 15-20 additional violations

### Sprint 2 Goals (Tier 2 - P1 Packages)
**Target:** 3 packages → Coverage increase to ~7%

- [ ] @radix-ui/* (universal contract)
- [ ] node-fetch
- [ ] cors

### Sprint 3 Goals (Tier 3 - P2 Packages)
**Target:** 4 packages → Coverage increase to ~10%

- [ ] papaparse
- [ ] xlsx
- [ ] mammoth
- [ ] react-pdf

### Sprint 4 Goals (Tier 4 - P3 Packages)
**Target:** 4 packages → Coverage increase to ~13%

- [ ] puppeteer
- [ ] date-fns
- [ ] uuid
- [ ] js-cookie

---

## Package Selection Criteria

### Impact Score (1-10)
- **Frequency of Use:** How often the package is imported
- **Error-Prone:** How likely to cause runtime errors
- **Critical Path:** Does it affect core functionality?

### Complexity Score (1-10)
- **API Surface:** How many functions/methods?
- **Error Patterns:** How diverse are error scenarios?
- **Documentation:** How well documented?

### Priority Formula
```
Priority = (Impact Score × 2) - (Complexity Score × 0.5)
```

Higher score = Higher priority

---

## Research Template

When researching a new package, document:

1. **Official Documentation Review**
   - Error handling patterns
   - Common pitfalls
   - Best practices

2. **CVE Analysis**
   - Known vulnerabilities
   - Security-related behaviors

3. **Real-World Usage**
   - Scan test repos for usage patterns
   - Identify common error scenarios

4. **Source Code Review**
   - Error types thrown
   - Edge cases in implementation

5. **Community Issues**
   - GitHub issues for common problems
   - Stack Overflow questions

---

## Adding New Packages to Queue

To nominate a package for the roadmap:

1. **Identify Usage:** Find in discovery reports
2. **Calculate Impact:** How many files use it?
3. **Assess Priority:** Use criteria above
4. **Add to Tier:** Place in appropriate tier
5. **Document Research:** Link to resources

---

## Completed Packages Archive

### @prisma/client
- **Completed:** 2026-02-23
- **Contract Version:** 1.0.0
- **Key Findings:** Handles 2-level property chains, connection errors

### @supabase/supabase-js
- **Completed:** 2026-02-23
- **Contract Version:** 1.0.0
- **Key Findings:** Connection errors, 4xx vs 5xx distinction needed

### axios
- **Completed:** 2026-02-23
- **Contract Version:** 1.0.0
- **Key Findings:** Network errors, timeout handling, response validation

### express
- **Completed:** 2026-02-24
- **Contract Version:** 1.0.0
- **Key Findings:** Async error handling in route handlers/middleware, error middleware patterns
- **Note:** Analyzer requires callback pattern detection enhancement for full support

### openai
- **Completed:** 2026-02-23
- **Contract Version:** 1.0.0
- **Key Findings:** API errors, rate limiting, streaming responses

### pg
- **Completed:** 2026-02-23
- **Contract Version:** 1.0.0
- **Key Findings:** Connection errors, query errors, transaction handling

### stripe
- **Completed:** 2026-02-23
- **Contract Version:** 1.0.0
- **Key Findings:** Card errors, API errors, idempotency

### @tanstack/react-query
- **Completed:** 2026-02-24
- **Contract Version:** 1.0.0
- **Key Findings:** Query/mutation error handling, retry patterns, stale data handling
- **Note:** Analyzer requires hook-based error pattern detection enhancement for full support

### zod
- **Completed:** 2026-02-24
- **Contract Version:** 1.0.0
- **Key Findings:** parse() throws ZodError, safeParse() returns result object, factory pattern creates schema instances
- **Note:** Analyzer requires factory pattern tracking enhancement. Contract validated against jake-tennis usage patterns. CVE-2023-4316 ReDoS in email validation (fixed in v3.22.3+).

### square
- **Completed:** 2026-02-25
- **Contract Version:** 1.0.0
- **Key Findings:** Payments/Orders/Customers/Locations APIs, SquareError handling, rate limiting (429), idempotency conflicts (409), payment declines (422)
- **Note:** 19 postconditions across 8 functions. Analyzer detected 75 errors correctly. No CVEs found. Phase 6 regression testing blocked by invalid contracts in corpus (unrelated issue).

### mongodb
- **Completed:** 2026-02-25
- **Contract Version:** 1.0.0
- **Key Findings:** Connection failures, query/write operations errors, duplicate key errors (11000), bulk write errors, network errors, instance tracking prevents false positives
- **Metrics:**
  - Functions Covered: 16 (connect, find, findOne, insertOne, insertMany, updateOne, updateMany, deleteOne, deleteMany, aggregate, countDocuments, createIndex, drop, collection, bulkWrite)
  - Fixture Violations Detected: 13 (proper: 0, missing: 4, instance: 11)
  - False Positive Rate: 0%
  - Real-World Repos Tested: 2 (parse-server, typeorm)
  - Regression Tests: 3/3 passed
- **CVEs Documented:**
  - CVE-2025-14847 (MongoBleed): Critical memory leak via zlib (CVSS 8.7)
  - CVE-2021-32050: Authentication data exposure in command listeners
- **Note:** Uses `require_instance_tracking: true` to prevent false positives on generic method names (.find, .update, etc.). Data-driven detection with 15 await patterns. TypeORM testing validated that ORM abstraction layers don't trigger violations.

---

## Notes

- Update this file when starting/completing package contracts
- Use discovery reports to identify new candidates
- Prioritize based on real-world usage data
- Validate all contracts against multiple test repos before marking complete

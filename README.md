# Behavioral Contracts Corpus

**The definitive open library of npm package behavioral contracts.**

This corpus encodes what npm packages promise to do — not just their types, but their **behavioral contracts**: what errors they throw, what conditions they expect, and what calling code must do to handle them correctly.

---

## What This Is

This is **not** a type library. This is **not** documentation.

This is a **machine-readable, AI-writable, human-auditable specification** of package behavior.

**The difference:**
- TypeScript types say: "this returns a `Promise<Response>`"
- Behavioral contracts say: "this throws on 429 and you **must** handle it"

---

## Why This Exists

When AI generates code, we need to verify it handles error states correctly. But "correct" is not defined anywhere except scattered documentation.

This corpus becomes the **standard reference** for what packages promise to do.

When someone asks "does this code handle axios errors correctly?", the answer is no longer opinion — it's a verifiable check against the contract.

---

## Structure

```
corpus/
├── SCHEMA.md              # Contract schema specification
├── CONTRIBUTING.md        # How to contribute contracts
├── packages/
│   ├── axios/
│   │   ├── contract.yaml  # Behavioral contract for axios
│   │   └── SOURCES.md     # Documentation sources
│   ├── jsonwebtoken/
│   ├── prisma/
│   ├── stripe/
│   └── bullmq/
└── schema/
    └── contract.schema.json  # JSON Schema for validation
```

---

## Current Coverage

**35 packages** with behavioral contracts (as of 2026-02-26)

### API Clients & SDKs (9 packages)
- ✅ **stripe** - Payment API errors, idempotency, webhooks
- ✅ **openai** - API errors, rate limiting, token handling
- ✅ **@anthropic-ai/sdk** - API errors, streaming, rate limits
- ✅ **@aws-sdk/client-s3** - S3 operations, credential errors
- ✅ **@sendgrid/mail** - Email API errors, validation
- ✅ **twilio** - SMS/voice API errors, webhook validation
- ✅ **cloudinary** - Image upload errors, transformation failures
- ✅ **square** - Payment errors, idempotency
- ✅ **@octokit/rest** - GitHub API errors, rate limiting

### Databases & ORMs (6 packages)
- ✅ **@prisma/client** - Null returns, constraint violations
- ✅ **mongodb** - Connection errors, query failures
- ✅ **mongoose** - Schema validation, connection handling
- ✅ **pg** - PostgreSQL errors, connection pooling
- ✅ **@vercel/postgres** - Serverless connection pooling
- ✅ **drizzle-orm** - Type-safe SQL errors

### Caching & Queues (3 packages)
- ✅ **redis** - Connection errors, data serialization
- ✅ **ioredis** - Cluster errors, pipeline failures
- ✅ **bullmq** - Job failures, worker errors, connection cleanup

### Web Frameworks (5 packages)
- ✅ **express** - Middleware errors, route handler failures
- ✅ **fastify** - Async handler errors, schema validation
- ✅ **next** - API route errors, server-side errors
- ✅ **socket.io** - WebSocket errors, event handler failures
- ✅ **@clerk/nextjs** - Authentication errors, session handling

### HTTP & Networking (1 package)
- ✅ **axios** - Network errors, timeouts, rate limiting (429)

### Real-time & Messaging (2 packages)
- ✅ **discord.js** - Bot errors, rate limiting, permission errors
- ✅ **@slack/web-api** - API errors, rate limiting

### Data & Storage (1 package)
- ✅ **@supabase/supabase-js** - Database errors, auth failures

### Validation & Forms (3 packages)
- ✅ **zod** - Schema validation errors, parsing failures
- ✅ **joi** - Validation errors, schema mismatches
- ✅ **react-hook-form** - Form validation, submission errors

### Blockchain (1 package)
- ✅ **ethers** - Transaction errors, network failures, gas errors

### Authentication (1 package)
- ✅ **firebase-admin** - Auth errors, Firestore operations

### State Management (1 package)
- ✅ **@tanstack/react-query** - Query errors, cache invalidation

### Type System (1 package)
- ✅ **typescript** - Compiler API errors, transformation failures

### Roadmap to 50 Packages
See [CATALOG.md](./CATALOG.md) for complete package index and upcoming additions.

---

## Using This Corpus

### With the CLI Tool

```bash
npx @behavioral-contracts/verify-cli --tsconfig ./tsconfig.json
```

The CLI analyzes your TypeScript code against contracts in this corpus.

### Programmatically

```typescript
import { loadCorpus } from '@behavioral-contracts/verify-cli';

const result = await loadCorpus('./corpus');
const axiosContract = result.contracts.get('axios');
```

### As a Standard

Cite contracts in:
- Code reviews: "This violates axios contract clause `rate-limited-429`"
- Documentation: "See behavioral-contracts/corpus for error handling requirements"
- Audit reports: "Verified against axios contract v1.0.0"

---

## Contributing

We need contracts for the top 100 npm packages.

**How to contribute:**
1. Read [SCHEMA.md](./SCHEMA.md) to understand the contract format
2. Choose a package from [CONTRIBUTING.md](./CONTRIBUTING.md)
3. Research the package's official documentation
4. Encode the behavioral contract
5. Test against real codebases
6. Submit a pull request

Every contract must:
- ✅ Link to authoritative documentation
- ✅ Validate against the JSON Schema
- ✅ Produce zero false positives
- ✅ Catch real violations in the wild

---

## License

**Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**

This corpus is open and free to use. Anyone can:
- ✅ Use contracts in their tools (commercial or non-commercial)
- ✅ Adapt contracts for their needs
- ✅ Share contracts with others
- ✅ Fork and modify the corpus

**You must:**
- 📝 Give credit to this corpus (attribution)
- 🔄 Share modifications under the same license (ShareAlike)

**You cannot:**
- ❌ Create proprietary forks (must stay open)
- ❌ Claim contracts are your own original work

### Why CC BY-SA 4.0?

**The ShareAlike clause prevents vendor lock-in:**

If Sentry (or any competitor) forks our corpus:
- ✅ They must keep it open source
- ✅ They must share improvements back
- ✅ They cannot build proprietary contract database
- ✅ The community benefits from all improvements

**What this means:**
- Individual developers: Use freely, forever ✅
- Companies: Use in CI/CD, tooling, products ✅
- SaaS providers: Use contracts in your service ✅
- Forks: Must stay open and share-alike ✅

**Example:**
```
✅ ALLOWED: Building a SaaS tool that uses these contracts
✅ ALLOWED: Forking to add your own contracts
✅ ALLOWED: Selling services based on these contracts
❌ NOT ALLOWED: Forking and making it proprietary
❌ NOT ALLOWED: Taking contracts and not crediting source
```

**This is the same license Wikipedia uses.** It ensures the standard stays open while allowing commercial use.

See [LICENSE](./LICENSE) for full legal text.

---

## Philosophy

### Accuracy Over Coverage
10 perfect contracts beat 100 noisy ones. Every contract must be precise.

### Documentation, Not Opinion
Contracts encode what the **docs say**, not what we wish they said.

### Community-Owned Standard
No vendor lock-in. This is infrastructure, not a product.

### Independence
The corpus is maintained separately from any analysis tool. This is what makes it a standard.

---

## Questions?

- **Schema questions**: Open an issue with label `schema-question`
- **Package-specific**: Open an issue with label `package:<name>`
- **General discussion**: Open an issue with label `discussion`

---

## Recognition

This corpus is built by the community:
- Contributors are credited in contract `maintainer` fields
- Contributors are listed in quarterly recognition posts
- Citations in research and tools credit the corpus

Thank you for helping make TypeScript codebases more auditable.

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

### Launch Packages (MVP)
- ✅ **axios** - HTTP error states, rate limiting, network failures
- 🚧 **jsonwebtoken** - Token verification, algorithm confusion
- 🚧 **prisma** - Null returns, database errors
- 🚧 **stripe** - Idempotency, webhooks, card errors
- 🚧 **bullmq** - Worker errors, connection failures

### Roadmap
See [CONTRIBUTING.md](./CONTRIBUTING.md) for priority packages.

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

**Creative Commons Attribution 4.0 International (CC BY 4.0)**

This corpus is open and free to use. Anyone can:
- Use contracts in their tools
- Adapt contracts for their needs
- Share contracts with others

**You must:** Give credit to this corpus.

**You cannot:** Claim contracts are your own original work.

This licensing makes the corpus a **public standard**, not a proprietary database.

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

# Usage Examples

**Practical guide to using behavioral contracts**

This guide shows you how to use contracts to verify code, guide reviews, and improve reliability.

---

## Quick Start

### 1. Verify Your Code

Use the CLI to check your codebase against behavioral contracts:

```bash
# Install the verification tool
npm install -g @behavioral-contracts/verify-cli

# Run verification
verify-contracts --tsconfig ./tsconfig.json

# Or use npx
npx @behavioral-contracts/verify-cli --tsconfig ./tsconfig.json
```

**Output:**
```
Analyzing codebase against 35 behavioral contracts...

Found 3 violations:

❌ axios-no-error-handling (ERROR)
   src/api/fetchUser.ts:15:3
   Missing try-catch around axios.get()

❌ prisma-findunique-null-check (ERROR)
   src/db/users.ts:23:5
   Must check for null after prisma.user.findUnique()

⚠️  stripe-missing-idempotency-key (WARNING)
   src/payments/charge.ts:42:10
   stripe.charges.create() should include idempotencyKey

3 violations found (2 errors, 1 warning)
```

###

 2. Fix Violations

Follow the contract guidance to fix issues:

**Before (violates axios contract):**
```typescript
async function fetchUser(id: string) {
  const response = await axios.get(`/users/${id}`);
  return response.data;
}
```

**After (follows axios contract):**
```typescript
async function fetchUser(id: string) {
  try {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.status === 429) {
        throw new Error('Rate limited - retry after delay');
      }
    }
    throw error;
  }
}
```

---

## Common Patterns

### HTTP Client Error Handling (axios)

**Contract:** `packages/axios/contract.yaml`

❌ **Violation:**
```typescript
const response = await axios.get('/api/data');
```

✅ **Correct:**
```typescript
try {
  const response = await axios.get('/api/data');
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle network errors
    console.error('API error:', error.message);
  }
  throw error;
}
```

---

### Database Null Checks (Prisma)

**Contract:** `packages/@prisma/client/contract.yaml`

❌ **Violation:**
```typescript
const user = await prisma.user.findUnique({ where: { id } });
console.log(user.email); // 💥 Can crash if user is null
```

✅ **Correct:**
```typescript
const user = await prisma.user.findUnique({ where: { id } });
if (!user) {
  throw new Error('User not found');
}
console.log(user.email); // ✅ Safe
```

---

### Connection Cleanup (Redis)

**Contract:** `packages/redis/contract.yaml`

❌ **Violation:**
```typescript
const redis = createClient();
await redis.connect();
const value = await redis.get('key');
// Missing disconnect - connection leak
```

✅ **Correct:**
```typescript
const redis = createClient();
try {
  await redis.connect();
  const value = await redis.get('key');
  return value;
} finally {
  await redis.disconnect();
}
```

---

### Validation Error Handling (Zod)

**Contract:** `packages/zod/contract.yaml`

❌ **Violation:**
```typescript
const data = schema.parse(input); // 💥 Throws on invalid input
```

✅ **Correct (explicit error handling):**
```typescript
try {
  const data = schema.parse(input);
  return data;
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation failed:', error.errors);
  }
  throw error;
}
```

✅ **Correct (safe parse):**
```typescript
const result = schema.safeParse(input);
if (!result.success) {
  console.error('Validation failed:', result.error);
  return null;
}
return result.data;
```

---

### API Idempotency (Stripe)

**Contract:** `packages/stripe/contract.yaml`

❌ **Warning:**
```typescript
await stripe.charges.create({
  amount: 1000,
  currency: 'usd',
  source: token,
});
// Missing idempotency key - retry could charge twice
```

✅ **Correct:**
```typescript
await stripe.charges.create(
  {
    amount: 1000,
    currency: 'usd',
    source: token,
  },
  {
    idempotencyKey: `charge_${orderId}`,
  }
);
```

---

### Worker Error Handling (BullMQ)

**Contract:** `packages/bullmq/contract.yaml`

❌ **Violation:**
```typescript
const worker = new Worker('myQueue', async (job) => {
  await processJob(job.data); // No error handling
});
```

✅ **Correct:**
```typescript
const worker = new Worker('myQueue', async (job) => {
  try {
    await processJob(job.data);
  } catch (error) {
    console.error('Job failed:', error);
    throw error; // BullMQ will retry
  }
});

worker.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});
```

---

### Event Handler Errors (Socket.IO)

**Contract:** `packages/socket.io/contract.yaml`

❌ **Violation:**
```typescript
socket.on('message', async (data) => {
  await processMessage(data); // Unhandled async error
});
```

✅ **Correct:**
```typescript
socket.on('message', async (data) => {
  try {
    await processMessage(data);
  } catch (error) {
    console.error('Message processing failed:', error);
    socket.emit('error', { message: 'Processing failed' });
  }
});
```

---

## Code Review Examples

### Using Contracts in Reviews

**Comment 1:**
> This violates `axios-no-error-handling` contract. Add try-catch to handle network errors. See: https://github.com/behavioral-contracts/corpus/blob/main/packages/axios/contract.yaml

**Comment 2:**
> Missing null check violates `prisma-findunique-null-check` contract. `findUnique` can return null when record doesn't exist.

**Comment 3:**
> Consider adding idempotency key (Stripe contract recommendation). Prevents double-charging on retry.

---

## Integration Examples

### CI/CD Integration

**GitHub Actions:**
```yaml
name: Verify Behavioral Contracts

on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx @behavioral-contracts/verify-cli --tsconfig ./tsconfig.json
      - name: Fail on errors
        if: failure()
        run: exit 1
```

**Pre-commit Hook:**
```bash
#!/bin/sh
# .git/hooks/pre-commit

npx @behavioral-contracts/verify-cli --tsconfig ./tsconfig.json

if [ $? -ne 0 ]; then
  echo "❌ Behavioral contract violations found"
  exit 1
fi
```

---

### ESLint Integration (Future)

```json
{
  "extends": ["plugin:behavioral-contracts/recommended"],
  "rules": {
    "behavioral-contracts/axios-error-handling": "error",
    "behavioral-contracts/prisma-null-checks": "error",
    "behavioral-contracts/stripe-idempotency": "warn"
  }
}
```

---

### TypeScript Plugin (Future)

```typescript
// In VS Code, underlines violations in real-time
const response = await axios.get('/api/data');
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ❌ Missing error handling (behavioral contract violation)
```

---

## Advanced Usage

### Custom Contract Enforcement

```typescript
import { loadCorpus, analyzeFile } from '@behavioral-contracts/verify-cli';

const corpus = await loadCorpus('./corpus');
const violations = await analyzeFile('src/api.ts', corpus);

for (const violation of violations) {
  if (violation.severity === 'error') {
    console.error(`❌ ${violation.description}`);
    console.error(`   ${violation.location}`);
  }
}
```

### Filtering Violations

```bash
# Show only errors (ignore warnings)
verify-contracts --severity error

# Check specific packages only
verify-contracts --packages axios,prisma

# Exclude specific rules
verify-contracts --exclude stripe-idempotency-key
```

### Generating Reports

```bash
# JSON output for tooling
verify-contracts --format json > violations.json

# HTML report
verify-contracts --format html > report.html

# Markdown for documentation
verify-contracts --format markdown > VIOLATIONS.md
```

---

## Real-World Examples

### Example 1: E-commerce Checkout

**Scenario:** Payment processing with Stripe

**Issues Found:**
1. Missing idempotency key → Double-charging risk
2. No error handling for card declines → Crashes on invalid card
3. No webhook signature validation → Security vulnerability

**Fix:**
```typescript
// Before: 3 contract violations
async function processPayment(amount: number, token: string) {
  const charge = await stripe.charges.create({
    amount,
    currency: 'usd',
    source: token,
  });
  return charge;
}

// After: 0 violations
async function processPayment(
  amount: number,
  token: string,
  orderId: string
) {
  try {
    const charge = await stripe.charges.create(
      {
        amount,
        currency: 'usd',
        source: token,
      },
      {
        idempotencyKey: `order_${orderId}`,
      }
    );
    return charge;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeCardError) {
      throw new Error(`Card declined: ${error.message}`);
    }
    throw error;
  }
}
```

---

### Example 2: User Dashboard with Prisma

**Scenario:** Fetching user profile data

**Issues Found:**
1. No null check after `findUnique` → Crashes on missing user
2. No error handling for database connection → Crashes on DB down

**Fix:**
```typescript
// Before: 2 violations
async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { posts: true },
  });
  return {
    name: user.name,
    email: user.email,
    postCount: user.posts.length,
  };
}

// After: 0 violations
async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { posts: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      name: user.name,
      email: user.email,
      postCount: user.posts.length,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Database error:', error.code);
    }
    throw error;
  }
}
```

---

### Example 3: Real-time Chat with Socket.IO

**Scenario:** WebSocket message handling

**Issues Found:**
1. Async event handlers without error handling → Server crashes on error
2. No error events emitted → Client unaware of failures

**Fix:**
```typescript
// Before: 2 violations
io.on('connection', (socket) => {
  socket.on('message', async (data) => {
    await saveMessage(data);
    socket.broadcast.emit('message', data);
  });
});

// After: 0 violations
io.on('connection', (socket) => {
  socket.on('message', async (data) => {
    try {
      await saveMessage(data);
      socket.broadcast.emit('message', data);
    } catch (error) {
      console.error('Message handling failed:', error);
      socket.emit('error', {
        type: 'message_failed',
        message: 'Could not process message',
      });
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});
```

---

## Best Practices

### 1. Run Verification Early

- Run in development (IDE integration)
- Run in pre-commit hooks
- Run in CI/CD pipelines
- Run before production deploys

### 2. Fix Errors First

- Errors indicate crash risks
- Warnings indicate reliability issues
- Prioritize fixes by severity

### 3. Document Exceptions

If you intentionally violate a contract:
```typescript
// behavioral-contracts-ignore: axios-no-error-handling
// Reason: Framework catches errors at top level
const response = await axios.get('/api/data');
```

### 4. Keep Contracts Updated

- Update corpus when package APIs change
- Contribute fixes for incorrect contracts
- Report false positives

### 5. Use in Learning

- Read contracts to understand error handling patterns
- Use contracts as documentation
- Train juniors with contract examples

---

## Getting Help

**Contract Questions:**
- Read the contract file: `corpus/packages/<package>/contract.yaml`
- Read the sources: `corpus/packages/<package>/SOURCES.md`
- Check official package docs

**Tool Issues:**
- Report false positives: [GitHub Issues](https://github.com/behavioral-contracts/verify-cli/issues)
- Request features: [GitHub Discussions](https://github.com/behavioral-contracts/verify-cli/discussions)
- Ask questions: [Stack Overflow tag: behavioral-contracts]

**Contributing:**
- Add new packages: See [CONTRIBUTING.md](./CONTRIBUTING.md)
- Fix existing contracts: Submit PR with rationale
- Improve documentation: PRs welcome

---

## Next Steps

1. **Try it now:** `npx @behavioral-contracts/verify-cli --tsconfig ./tsconfig.json`
2. **Read contracts:** Browse [CATALOG.md](./CATALOG.md) for available packages
3. **Add to CI:** Integrate into your build pipeline
4. **Contribute:** Help add contracts for more packages

---

**Making TypeScript code more reliable, one contract at a time.**

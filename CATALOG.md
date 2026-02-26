# Package Catalog

**Complete index of behavioral contracts in the corpus**

Last Updated: 2026-02-26
Total Packages: 35
Target: 50 packages

---

## Quick Stats

| Category | Packages | Coverage |
|----------|----------|----------|
| API Clients & SDKs | 9 | 26% |
| Databases & ORMs | 6 | 17% |
| Web Frameworks | 5 | 14% |
| Caching & Queues | 3 | 9% |
| Validation & Forms | 3 | 9% |
| Real-time & Messaging | 2 | 6% |
| Other | 7 | 20% |

---

## Package Index

### API Clients & SDKs

#### stripe
- **Version:** ^14.0.0
- **Category:** api-client
- **Functions:** 5 (create, retrieve, update, delete, list)
- **Key Behaviors:** Idempotency keys, webhook signature validation, card errors
- **Status:** ✅ Complete
- **Path:** `packages/stripe/`

#### openai
- **Version:** ^4.0.0
- **Category:** api-client
- **Functions:** 2 (chat.completions.create, embeddings.create)
- **Key Behaviors:** API errors, rate limiting, streaming errors
- **Status:** ✅ Complete
- **Path:** `packages/openai/`

#### @anthropic-ai/sdk
- **Version:** ^0.20.0
- **Category:** api-client
- **Functions:** 2 (messages.create, messages.stream)
- **Key Behaviors:** API errors, rate limiting, streaming handling
- **Status:** ✅ Complete
- **Path:** `packages/@anthropic-ai/sdk/`

#### @aws-sdk/client-s3
- **Version:** ^3.0.0
- **Category:** api-client
- **Functions:** 4 (PutObject, GetObject, DeleteObject, ListObjects)
- **Key Behaviors:** Credential errors, network failures, bucket errors
- **Status:** ✅ Complete
- **Path:** `packages/@aws-sdk/client-s3/`

#### @sendgrid/mail
- **Version:** ^8.0.0
- **Category:** api-client
- **Functions:** 1 (send)
- **Key Behaviors:** API errors, validation errors, rate limiting
- **Status:** ✅ Complete
- **Path:** `packages/@sendgrid/mail/`

#### twilio
- **Version:** ^5.0.0
- **Category:** api-client
- **Functions:** 2 (messages.create, validateRequest)
- **Key Behaviors:** SMS errors, webhook validation
- **Status:** ✅ Complete
- **Path:** `packages/twilio/`

#### cloudinary
- **Version:** ^2.0.0
- **Category:** api-client
- **Functions:** 2 (uploader.upload, uploader.destroy)
- **Key Behaviors:** Upload errors, transformation failures
- **Status:** ✅ Complete
- **Path:** `packages/cloudinary/`

#### square
- **Version:** ^35.0.0
- **Category:** api-client
- **Functions:** 3 (payments.create, payments.get, refunds.create)
- **Key Behaviors:** Payment errors, idempotency
- **Status:** ✅ Complete
- **Path:** `packages/square/`

#### @octokit/rest
- **Version:** ^20.0.0
- **Category:** api-client
- **Functions:** 3 (issues.create, pulls.create, repos.get)
- **Key Behaviors:** API errors, rate limiting, authentication errors
- **Status:** ✅ Complete
- **Path:** `packages/@octokit/rest/`

---

### Databases & ORMs

#### @prisma/client
- **Version:** ^5.0.0 || ^6.0.0 || ^7.0.0
- **Category:** database
- **Functions:** 5 (findUnique, create, update, delete, findMany)
- **Key Behaviors:** Null returns, constraint violations, connection errors
- **Status:** ✅ Complete
- **Path:** `packages/@prisma/client/`

#### mongodb
- **Version:** ^6.0.0
- **Category:** database
- **Functions:** 4 (insertOne, find, updateOne, deleteOne)
- **Key Behaviors:** Connection errors, query failures, validation errors
- **Status:** ✅ Complete
- **Path:** `packages/mongodb/`

#### mongoose
- **Version:** ^8.0.0
- **Category:** database
- **Functions:** 4 (save, find, updateOne, deleteOne)
- **Key Behaviors:** Schema validation, connection handling, cast errors
- **Status:** ✅ Complete
- **Path:** `packages/mongoose/`

#### pg
- **Version:** ^8.0.0
- **Category:** database
- **Functions:** 2 (query, connect)
- **Key Behaviors:** Connection pooling, SQL errors, client release
- **Status:** ✅ Complete
- **Path:** `packages/pg/`

#### @vercel/postgres
- **Version:** ^0.10.0
- **Category:** database
- **Functions:** 3 (sql, query, connect)
- **Key Behaviors:** Serverless pooling, connection cleanup, SQL errors
- **Status:** ✅ Complete (deprecated, patterns still valid)
- **Path:** `packages/@vercel/postgres/`

#### drizzle-orm
- **Version:** ^0.30.0
- **Category:** database
- **Functions:** 4 (select, insert, update, delete)
- **Key Behaviors:** Type-safe queries, constraint violations, SQL errors
- **Status:** ✅ Complete
- **Path:** `packages/drizzle-orm/`

---

### Caching & Queues

#### redis
- **Version:** ^4.0.0
- **Category:** cache
- **Functions:** 3 (get, set, del)
- **Key Behaviors:** Connection errors, serialization, command failures
- **Status:** ✅ Complete
- **Path:** `packages/redis/`

#### ioredis
- **Version:** ^5.0.0
- **Category:** cache
- **Functions:** 4 (get, set, pipeline, quit)
- **Key Behaviors:** Cluster errors, pipeline failures, connection cleanup
- **Status:** ✅ Complete
- **Path:** `packages/ioredis/`

#### bullmq
- **Version:** ^5.0.0
- **Category:** queue
- **Functions:** 4 (Queue.add, Queue.addBulk, Worker.process, close)
- **Key Behaviors:** Job failures, worker errors, connection cleanup
- **Status:** ✅ Complete
- **Path:** `packages/bullmq/`

---

### Web Frameworks

#### express
- **Version:** ^4.0.0 || ^5.0.0
- **Category:** framework
- **Functions:** 1 (app.use, app.get, app.post)
- **Key Behaviors:** Middleware errors, async handler failures, error middleware
- **Status:** ✅ Complete
- **Path:** `packages/express/`

#### fastify
- **Version:** ^4.0.0 || ^5.0.0
- **Category:** framework
- **Functions:** 1 (get)
- **Key Behaviors:** Async route handler errors, schema validation
- **Status:** ✅ Complete
- **Path:** `packages/fastify/`

#### next
- **Version:** ^14.0.0 || ^15.0.0
- **Category:** framework
- **Functions:** 1 (GET - API route handler)
- **Key Behaviors:** API route errors, server-side rendering errors
- **Status:** ✅ Complete
- **Path:** `packages/next/`

#### socket.io
- **Version:** ^4.0.0
- **Category:** websocket
- **Functions:** 2 (on, emit)
- **Key Behaviors:** Event handler errors, connection failures, emit errors
- **Status:** ✅ Complete
- **Path:** `packages/socket.io/`

#### @clerk/nextjs
- **Version:** ^5.0.0 || ^6.0.0
- **Category:** framework
- **Functions:** 2 (currentUser, auth)
- **Key Behaviors:** Authentication errors, session handling, null returns
- **Status:** ✅ Complete
- **Path:** `packages/@clerk/nextjs/`

---

### HTTP & Networking

#### axios
- **Version:** ^1.0.0
- **Category:** http-client
- **Functions:** 5 (get, post, put, delete, request)
- **Key Behaviors:** Network errors, timeouts, rate limiting (429)
- **Status:** ✅ Complete
- **Path:** `packages/axios/`

---

### Real-time & Messaging

#### discord.js
- **Version:** ^14.0.0
- **Category:** bot-framework
- **Functions:** 3 (send, reply, createInvite)
- **Key Behaviors:** Bot errors, rate limiting, permission errors
- **Status:** ✅ Complete
- **Path:** `packages/discord.js/`

#### @slack/web-api
- **Version:** ^7.0.0
- **Category:** api-client
- **Functions:** 2 (chat.postMessage, conversations.list)
- **Key Behaviors:** API errors, rate limiting, channel errors
- **Status:** ✅ Complete
- **Path:** `packages/@slack/web-api/`

---

### Data & Storage

#### @supabase/supabase-js
- **Version:** ^2.0.0
- **Category:** database
- **Functions:** 4 (select, insert, update, delete)
- **Key Behaviors:** Database errors, auth failures, RLS errors
- **Status:** ✅ Complete
- **Path:** `packages/@supabase/supabase-js/`

---

### Validation & Forms

#### zod
- **Version:** ^3.0.0
- **Category:** validation
- **Functions:** 2 (parse, safeParse)
- **Key Behaviors:** Schema validation errors, parsing failures
- **Status:** ✅ Complete
- **Path:** `packages/zod/`

#### joi
- **Version:** ^17.0.0
- **Category:** validation
- **Functions:** 1 (validate)
- **Key Behaviors:** Validation errors, schema mismatches
- **Status:** ✅ Complete
- **Path:** `packages/joi/`

#### react-hook-form
- **Version:** ^7.0.0
- **Category:** validation
- **Functions:** 1 (handleSubmit)
- **Key Behaviors:** Form validation, submission errors
- **Status:** ✅ Complete
- **Path:** `packages/react-hook-form/`

---

### Blockchain

#### ethers
- **Version:** ^6.0.0
- **Category:** blockchain
- **Functions:** 2 (sendTransaction, call)
- **Key Behaviors:** Transaction errors, network failures, gas errors
- **Status:** ✅ Complete
- **Path:** `packages/ethers/`

---

### Authentication

#### firebase-admin
- **Version:** ^12.0.0
- **Category:** backend-service
- **Functions:** 4 (auth.verifyIdToken, firestore operations)
- **Key Behaviors:** Auth errors, Firestore failures, service account errors
- **Status:** ✅ Complete
- **Path:** `packages/firebase-admin/`

---

### State Management

#### @tanstack/react-query
- **Version:** ^5.0.0
- **Category:** state-management
- **Functions:** 2 (useQuery, useMutation)
- **Key Behaviors:** Query errors, cache invalidation, retry logic
- **Status:** ✅ Complete
- **Path:** `packages/@tanstack/react-query/`

---

### Type System

#### typescript
- **Version:** ^5.0.0
- **Category:** compiler
- **Functions:** 2 (createProgram, transpile)
- **Key Behaviors:** Compiler errors, transformation failures
- **Status:** ✅ Complete
- **Path:** `packages/typescript/`

---

## Upcoming Packages (Phase 4b - Target: 50)

### Tier 1: High-Priority (8 packages)
1. **dotenv** - Environment variable loading errors
2. **jsonwebtoken** - JWT verification, algorithm confusion (CVE-2015-9235)
3. **bcrypt** - Hashing errors, salt generation
4. **multer** - File upload errors, validation
5. **helmet** - Security header configuration
6. **cors** - CORS configuration errors
7. **winston** - Logging errors, transport failures
8. **passport** - Authentication strategy errors

### Tier 2: Frameworks & Databases (4 packages)
9. **knex** - Query builder errors, transaction handling
10. **typeorm** - Entity errors, repository operations
11. **@nestjs/common** - Dependency injection, module errors
12. **@hapi/hapi** - Server errors, plugin failures

### Tier 3: API & Utilities (3 packages)
13. **graphql** - Schema errors, resolver failures
14. **uuid** - Generation errors (rare)
15. **date-fns** - Date parsing errors

---

## Package Statistics

### By Maturity
- **Production-Ready:** 35 packages (100%)
- **Validated:** 35 packages (100%)
- **Fixtures Complete:** 35 packages (100%)

### By Detection Method
- **Type-Aware Detection:** 35 packages (100%)
- **Pattern Detection:** 35 packages (100% as fallback)
- **Both Methods:** 35 packages (100%)

### Quality Metrics
- **Average Functions/Package:** 2.8
- **Average Postconditions/Package:** 2.3
- **Validation Pass Rate:** 100% (10/10 checks)
- **Fixture Coverage:** 100% (proper + missing + instance)

---

## Usage by Category

### Most Common Categories
1. **api-client** - 9 packages (26%)
2. **database** - 6 packages (17%)
3. **framework** - 5 packages (14%)

### Error Types Covered
- Network errors (HTTP clients, API clients)
- Database errors (ORMs, database clients)
- Validation errors (schema validators)
- Authentication errors (auth libraries)
- Connection errors (caching, queues)
- Transaction errors (payment processors)
- Permission errors (bot frameworks)

---

## Contributing

Want to add a package? See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Priority areas:**
- Environment & configuration (dotenv, config)
- Security (jwt, bcrypt, helmet)
- File handling (multer, formidable)
- Testing (jest, mocha, vitest)
- Build tools (webpack, vite, esbuild)

---

## Version Support

Packages support multiple major versions where applicable:
- Prisma: v5.x, v6.x, v7.x
- Express: v4.x, v5.x
- Clerk: v5.x, v6.x
- Next.js: v14.x, v15.x

Older major versions may be added based on usage data.

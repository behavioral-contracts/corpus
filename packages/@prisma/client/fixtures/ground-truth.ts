/**
 * Prisma (@prisma/client) Ground-Truth Fixture
 *
 * Each call site is annotated // SHOULD_FIRE or // SHOULD_NOT_FIRE.
 * Derived from the @prisma/client contract spec, NOT V1 behavior.
 *
 * Key contract rules:
 *   - prisma.user.create, .update, .delete, .findUnique, .findUniqueOrThrow,
 *     .$transaction, .$connect, .$disconnect all have error-severity postconditions
 *     with `throws:` — each requires a try-catch
 *   - V2 uses PropertyChainDetector for patterns like prisma.user.create(...)
 *   - A try-catch at any level wrapping the call satisfies the requirement
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// 1. create — missing try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function createUserNoCatch(email: string, name: string) {
  // SHOULD_FIRE: unique-constraint-violation — prisma.user.create can throw P2002, no try-catch
  const user = await prisma.user.create({ data: { email, name } });
  return user;
}

export async function createUserWithCatch(email: string, name: string) {
  try {
    // SHOULD_NOT_FIRE: create inside try-catch satisfies error handling requirement
    const user = await prisma.user.create({ data: { email, name } });
    return user;
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new Error('Email already exists');
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. update — missing try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function updateUserNoCatch(id: string, email: string) {
  // SHOULD_FIRE: record-not-found — prisma.user.update throws P2025 if record not found, no try-catch
  const user = await prisma.user.update({ where: { id }, data: { email } });
  return user;
}

export async function updateUserWithCatch(id: string, email: string) {
  try {
    // SHOULD_NOT_FIRE: update inside try-catch is safe
    const user = await prisma.user.update({ where: { id }, data: { email } });
    return user;
  } catch (err) {
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. delete — missing try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteUserNoCatch(id: string) {
  // SHOULD_FIRE: record-not-found — prisma.user.delete throws P2025 if not found, no try-catch
  await prisma.user.delete({ where: { id } });
}

export async function deleteUserWithCatch(id: string) {
  try {
    // SHOULD_NOT_FIRE: delete inside try-catch is safe
    await prisma.user.delete({ where: { id } });
  } catch (err) {
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. findUnique — missing try-catch (throws on connection error; returns null on not-found)
// ─────────────────────────────────────────────────────────────────────────────

export async function findUserNoCatch(id: string) {
  // SHOULD_FIRE: record-not-found — prisma.user.findUnique returns null if not found; no null check or try-catch
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
}

export async function findUserWithCatch(id: string) {
  try {
    // SHOULD_NOT_FIRE: findUnique inside try-catch satisfies error handling
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (err) {
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. findUniqueOrThrow — always throws on not-found, MUST try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function findUniqueOrThrowNoCatch(id: string) {
  // SHOULD_FIRE: record-not-found — findUniqueOrThrow throws P2025, no try-catch
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  return user;
}

export async function findUniqueOrThrowWithCatch(id: string) {
  try {
    // SHOULD_NOT_FIRE: findUniqueOrThrow inside try-catch is safe
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    return user;
  } catch (err: any) {
    if (err.code === 'P2025') return null;
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. $transaction — missing try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function transactionNoCatch() {
  // SHOULD_FIRE: transaction-failed — $transaction throws on any operation failure, no try-catch
  await prisma.$transaction(async (tx) => {
    await tx.user.create({ data: { email: 'a@test.com', name: 'Test' } });
  });
}

export async function transactionWithCatch() {
  try {
    // SHOULD_NOT_FIRE: $transaction inside try-catch is safe
    await prisma.$transaction(async (tx) => {
      await tx.user.create({ data: { email: 'b@test.com', name: 'Test' } });
    });
  } catch (err) {
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. $connect — missing try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function connectNoCatch() {
  // SHOULD_FIRE: connection-failed — $connect throws PrismaClientInitializationError, no try-catch
  await prisma.$connect();
}

export async function connectWithCatch() {
  try {
    // SHOULD_NOT_FIRE: $connect inside try-catch is safe
    await prisma.$connect();
  } catch (err) {
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Class methods
// ─────────────────────────────────────────────────────────────────────────────

export class UserRepository {
  private db = new PrismaClient();

  async createUser(email: string, name: string) {
    // SHOULD_FIRE: unique-constraint-violation — class method, no try-catch
    const user = await this.db.user.create({ data: { email, name } });
    return user;
  }

  async safeCreate(email: string, name: string) {
    try {
      // SHOULD_NOT_FIRE: class method with try-catch is safe
      const user = await this.db.user.create({ data: { email, name } });
      return user;
    } catch (err) {
      throw err;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Arrow functions
// ─────────────────────────────────────────────────────────────────────────────

export const arrowCreateNoCatch = async (email: string, name: string) => {
  // SHOULD_FIRE: unique-constraint-violation — arrow function, no try-catch
  const user = await prisma.user.create({ data: { email, name } });
  return user;
};

export const arrowCreateWithCatch = async (email: string, name: string) => {
  try {
    // SHOULD_NOT_FIRE: arrow function with try-catch is safe
    const user = await prisma.user.create({ data: { email, name } });
    return user;
  } catch (err) {
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. Nested try — call inside inner catch (no try wrapping it)
// ─────────────────────────────────────────────────────────────────────────────

export async function callInCatchBlock() {
  try {
    console.log('start');
  } catch (err) {
    // This call is in the catch block, NOT in a try block — should fire
    // SHOULD_FIRE: unique-constraint-violation — create in catch block is not wrapped in try-catch
    await prisma.user.create({ data: { email: 'fallback@test.com', name: 'Fallback' } });
  }
}

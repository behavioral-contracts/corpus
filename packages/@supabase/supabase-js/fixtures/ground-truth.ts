/**
 * @supabase/supabase-js Ground-Truth Fixture
 *
 * Tests the builder-pattern result API: supabase.from('table').select/insert/update/delete/rpc()
 * Supabase does NOT throw — it returns { data, error }. The contract requires wrapping in
 * try-catch so that any thrown network or auth errors are handled.
 *
 * Annotation format:
 *   // SHOULD_FIRE: <postcondition-id> — <reason>   (line AFTER = call site)
 *   // SHOULD_NOT_FIRE: <reason>                     (line AFTER = call site)
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://example.supabase.co',
  process.env.SUPABASE_KEY || 'dummy-key'
);

// ──────────────────────────────────────────────────────────────────────────────
// MISSING error handling (should fire)
// ──────────────────────────────────────────────────────────────────────────────

async function missingSelect() {
  // SHOULD_FIRE: rls-policy-violation — no try-catch around select builder chain
  const { data, error } = await supabase
    .from('users')
    .select('*');
  return data;
}

async function missingInsert() {
  // SHOULD_FIRE: rls-policy-violation — no try-catch around insert
  const { data } = await supabase
    .from('users')
    .insert({ name: 'Alice', email: 'alice@example.com' });
  return data;
}

async function missingUpdate() {
  // SHOULD_FIRE: rls-policy-violation — no try-catch around update builder chain
  const { data } = await supabase
    .from('users')
    .update({ name: 'Bob' })
    .eq('id', 1);
  return data;
}

async function missingDelete() {
  // SHOULD_FIRE: rls-policy-violation — no try-catch around delete builder chain
  const { data } = await supabase
    .from('users')
    .delete()
    .eq('id', 1);
  return data;
}

async function missingRpc() {
  // SHOULD_FIRE: function-not-found — no try-catch around rpc call
  const { data } = await supabase
    .rpc('my_function', { param: 'value' });
  return data;
}

// ──────────────────────────────────────────────────────────────────────────────
// PROPER error handling (should NOT fire)
// ──────────────────────────────────────────────────────────────────────────────

async function properSelect() {
  try {
    // SHOULD_NOT_FIRE: select is wrapped in try-catch
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Query failed:', err);
    throw err;
  }
}

async function properInsert() {
  try {
    // SHOULD_NOT_FIRE: insert is wrapped in try-catch
    const { data, error } = await supabase
      .from('users')
      .insert({ name: 'Alice', email: 'alice@example.com' })
      .select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Insert failed:', err);
    throw err;
  }
}

async function properRpc() {
  try {
    // SHOULD_NOT_FIRE: rpc is wrapped in try-catch
    const { data, error } = await supabase.rpc('my_function', { param: 'value' });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('RPC failed:', err);
    throw err;
  }
}

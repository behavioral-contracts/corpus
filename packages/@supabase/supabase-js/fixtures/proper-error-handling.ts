/**
 * Supabase Fixtures - Proper Error Handling
 *
 * These examples demonstrate CORRECT error handling for Supabase.
 * Should NOT trigger any violations.
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://example.supabase.co',
  process.env.SUPABASE_KEY || 'dummy-key'
);

/**
 * Proper error handling for query
 */
async function fetchUsersWithProperErrorHandling() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Query failed:', error.message);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
}

/**
 * Proper error handling for insert
 */
async function insertUserWithProperErrorHandling(user: { name: string; email: string }) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select();
    
    if (error) {
      console.error('Insert failed:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}

/**
 * Proper error handling for update
 */
async function updateUserWithProperErrorHandling(id: number, name: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Update failed:', err);
    throw err;
  }
}

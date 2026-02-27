/**
 * Undetectable Safety Issues
 * 
 * This fixture demonstrates the REAL lodash safety concerns that
 * the analyzer CANNOT detect (99% of actual issues).
 * 
 * Expected: 0 violations (analyzer can't detect these patterns)
 * Actual Safety Risk: HIGH (all of these have problems)
 */

import _ from 'lodash';

/**
 * ⚠️ UNDETECTABLE: Missing _.get() validation
 * 
 * Real Issue: url might be undefined, causing fetch to fail
 * Analyzer: Cannot detect - _.get() doesn't throw, returns undefined
 */
export function fetchDataUnsafe(config: any) {
  const url = _.get(config, 'api.url');
  // ⚠️ url might be undefined\! But no exception thrown
  return fetch(url); // Will fail if url is undefined
}

/**
 * ⚠️ UNDETECTABLE: Silent _.map() failure
 * 
 * Real Issue: If items is undefined, _.map returns [] (silent failure)
 * Analyzer: Cannot detect - _.map() doesn't throw
 */
export function processItemsUnsafe(items: any) {
  // ⚠️ If items is undefined, this returns [] instead of throwing
  const ids = _.map(items, 'id');
  
  // Logic continues with empty array - bug not caught\!
  if (ids.length > 0) {
    console.log('Processing', ids.length, 'items');
  } else {
    // This executes even when items was undefined (silent failure)
    console.log('No items to process');
  }
}

/**
 * ⚠️ UNDETECTABLE: Unchecked _.find() result
 * 
 * Real Issue: user might be undefined, causing .name access to throw
 * Analyzer: Cannot detect - _.find() doesn't throw, _.get() on undefined needed
 */
export function getUserNameUnsafe(users: any[], id: number) {
  const user = _.find(users, { id });
  // ⚠️ user might be undefined\!
  return user.name; // TypeError: Cannot read property 'name' of undefined
}

/**
 * ⚠️ UNDETECTABLE: Missing _.isEmpty() check
 * 
 * Real Issue: Should validate before processing
 * Analyzer: Cannot detect - no exception pattern
 */
export function processArrayUnsafe(items: any[]) {
  // ⚠️ Should check _.isEmpty(items) first
  const first = _.head(items); // Returns undefined if empty
  const last = _.last(items);   // Returns undefined if empty
  
  // ⚠️ Might access properties on undefined
  console.log(first.value, last.value);
}

/**
 * ⚠️ UNDETECTABLE: Unchecked _.get() with nested path
 * 
 * Real Issue: Entire chain might be undefined
 * Analyzer: Cannot detect - _.get() returns undefined, doesn't throw
 */
export function getNestedValueUnsafe(obj: any) {
  const value = _.get(obj, 'a.b.c.d.e');
  // ⚠️ value might be undefined, but no error\!
  return value.toString(); // TypeError if undefined
}

/**
 * ⚠️ UNDETECTABLE: Silent _.filter() with wrong input
 * 
 * Real Issue: If items is not an array, _.filter returns []
 * Analyzer: Cannot detect - no exception
 */
export function filterItemsUnsafe(items: any) {
  // ⚠️ If items is null/undefined/string, this returns []
  const filtered = _.filter(items, item => item.active);
  
  // Continues with empty array - logic bug not detected
  return filtered;
}

/**
 * ⚠️ UNDETECTABLE: Missing _.isNil() guard
 * 
 * Real Issue: Should check for null/undefined before processing
 * Analyzer: Cannot detect - no try-catch pattern
 */
export function processValueUnsafe(value: any) {
  // ⚠️ Should use _.isNil() check first
  const upper = value.toUpperCase(); // TypeError if null/undefined
  return upper;
}

/**
 * ✅ CORRECT (but undetectable): Proper validation
 * 
 * This is how lodash SHOULD be used, but analyzer can't enforce it.
 */
export function fetchDataSafe(config: any) {
  const url = _.get(config, 'api.url');
  
  // ✅ Validate before use
  if (\!url) {
    throw new Error('API URL not configured');
  }
  
  return fetch(url);
}

/**
 * ✅ CORRECT (but undetectable): Proper _.find() check
 */
export function getUserNameSafe(users: any[], id: number) {
  const user = _.find(users, { id });
  
  // ✅ Check for undefined
  if (\!user) {
    throw new Error(`User ${id} not found`);
  }
  
  return user.name;
}

/**
 * ✅ CORRECT (but undetectable): Proper _.isEmpty() check
 */
export function processArraySafe(items: any[]) {
  // ✅ Validate before processing
  if (_.isEmpty(items)) {
    throw new Error('Cannot process empty array');
  }
  
  const first = _.head(items);
  const last = _.last(items);
  
  return { first, last };
}

/**
 * Summary:
 * - All unsafe functions have REAL safety issues
 * - All safe functions handle validation correctly
 * - Analyzer detects: 0 violations (can't detect return value checks)
 * - Actual violations: 7+ serious safety issues
 * - Detection rate: 0% for the REAL problems
 */

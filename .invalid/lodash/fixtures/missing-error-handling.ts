/**
 * Missing Error Handling for lodash
 * 
 * This fixture demonstrates INCORRECT error handling for _.template(),
 * the only lodash function that throws exceptions.
 * 
 * Expected: Violations detected for _.template() without try-catch
 */

import _ from 'lodash';

/**
 * ❌ VIOLATION: _.template() without try-catch
 * 
 * If templateString has syntax error, this will throw and crash.
 */
export function compileTemplateUnsafe(templateString: string) {
  // ❌ No try-catch - should trigger ERROR violation
  const compiled = _.template(templateString);
  return compiled({ name: 'World' });
}

/**
 * ❌ VIOLATION: _.template() in async function without try-catch
 */
export async function compileTemplateAsync(templateString: string) {
  // ❌ No try-catch - should trigger ERROR violation
  const compiled = _.template(templateString);
  const result = compiled({ data: { user: 'Alice' } });
  return result;
}

/**
 * ❌ VIOLATION: Multiple _.template() calls without error handling
 */
export function compileMultipleTemplates(templates: string[]) {
  // ❌ No try-catch - should trigger ERROR violation for each
  return templates.map(t => _.template(t));
}

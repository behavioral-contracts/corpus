/**
 * Proper Error Handling for lodash
 * 
 * This fixture demonstrates CORRECT error handling for _.template(),
 * the only lodash function that throws exceptions.
 * 
 * Expected: 0 violations
 */

import _ from 'lodash';

/**
 * PROPER: _.template() with try-catch
 * 
 * _.template() can throw SyntaxError if template has invalid syntax.
 * This properly wraps it in try-catch.
 */
export async function compileTemplateWithErrorHandling(templateString: string) {
  try {
    const compiled = _.template(templateString);
    return compiled({ name: 'World' });
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Template syntax error:', error.message);
    }
    throw new Error('Failed to compile template');
  }
}

/**
 * PROPER: Using _.attempt() (lodash's error handler)
 */
export function compileTemplateWithAttempt(templateString: string) {
  const result = _.attempt(() => _.template(templateString));
  
  if (_.isError(result)) {
    console.error('Template compilation failed:', result.message);
    return null;
  }
  
  return result({ name: 'World' });
}

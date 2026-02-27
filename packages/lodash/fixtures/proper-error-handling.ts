import _ from 'lodash';

/**
 * Proper error handling for lodash.template()
 * Should NOT trigger violations.
 */
function compileTemplateWithErrorHandling(templateStr: string) {
  try {
    const compiled = _.template(templateStr);
    return compiled({ name: 'World' });
  } catch (error) {
    console.error('Template compilation failed:', error);
    throw error;
  }
}

/**
 * Proper input validation for _.merge with untrusted data
 * Should NOT trigger violations - validates input.
 */
function safeMergeConfig(userInput: any) {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  const hasDangerousKeys = Object.keys(userInput).some(key =>
    dangerousKeys.includes(key)
  );

  if (hasDangerousKeys) {
    throw new Error('Invalid input: contains prototype pollution keys');
  }

  const config = { timeout: 5000, retries: 3 };
  return _.merge(config, userInput);
}

/**
 * Proper path validation for _.unset with untrusted paths
 * Should NOT trigger violations - validates path.
 */
function safeUnsetProperty(obj: any, userPath: string) {
  if (userPath.includes('__proto__') ||
      userPath.includes('constructor') ||
      userPath.includes('prototype')) {
    throw new Error('Invalid path: contains dangerous keywords');
  }

  _.unset(obj, userPath);
  return obj;
}

/**
 * Safe usage of _.attempt - checks for errors
 * Should NOT trigger violations.
 */
function safeJsonParse(jsonStr: string) {
  const result = _.attempt(() => JSON.parse(jsonStr));

  if (_.isError(result)) {
    console.error('JSON parse failed:', result.message);
    return null;
  }

  return result;
}

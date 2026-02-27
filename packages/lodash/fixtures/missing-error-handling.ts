import _ from 'lodash';

/**
 * Missing error handling for lodash.template()
 * Should trigger ERROR violation.
 */
function compileTemplateWithoutErrorHandling(templateStr: string) {
  // ❌ No try-catch
  const compiled = _.template(templateStr);
  return compiled({ name: 'World' });
}

/**
 * UNSAFE: _.merge with untrusted input - no validation
 * Should trigger ERROR violation - prototype pollution risk.
 */
function unsafeMergeConfig(userInput: any) {
  const config = { timeout: 5000, retries: 3 };
  // ❌ No validation of userInput - prototype pollution risk
  return _.merge(config, userInput);
}

/**
 * UNSAFE: _.unset with untrusted path - no validation
 * Should trigger ERROR violation - prototype pollution risk.
 */
function unsafeUnsetProperty(obj: any, userPath: string) {
  // ❌ No validation of userPath - can delete prototype methods
  _.unset(obj, userPath);
  return obj;
}

/**
 * UNSAFE: _.defaultsDeep with untrusted input
 * Should trigger ERROR violation - prototype pollution risk.
 */
function unsafeDefaultsDeep(userDefaults: any) {
  const defaults = { theme: 'light', lang: 'en' };
  // ❌ No validation - can pollute Object.prototype
  return _.defaultsDeep(userDefaults, defaults);
}

/**
 * UNSAFE: _.omit with untrusted paths
 * Should trigger ERROR violation - prototype pollution risk.
 */
function unsafeOmitProperties(obj: any, userPaths: string[]) {
  // ❌ No validation of paths - can delete prototype methods
  return _.omit(obj, userPaths);
}

/**
 * UNSAFE: _.attempt without checking for error
 * Should trigger WARNING violation - not checking _.isError().
 */
function unsafeAttemptParse(jsonStr: string) {
  const result = _.attempt(() => JSON.parse(jsonStr));
  // ❌ Not checking if result is Error
  return result.data; // May crash if result is Error
}

/**
 * MISSING error handling patterns for jsonschema package
 * These examples SHOULD trigger violations
 */

import { Validator, validate } from 'jsonschema';

/**
 * VIOLATION 1: Using throwFirst without try-catch
 * Should trigger ERROR - throws ValidatorResultError
 */
function violationThrowFirstNoTryCatch(data: unknown) {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  };

  // ❌ No try-catch - will throw if validation fails
  const result = validate(data, schema, { throwFirst: true });
  return result;
}

/**
 * VIOLATION 2: Using throwAll without try-catch
 * Should trigger ERROR - throws ValidatorResultError
 */
function violationThrowAllNoTryCatch(data: unknown, schema: object) {
  const v = new Validator();

  // ❌ No try-catch - will throw after collecting all errors
  const result = v.validate(data, schema, { throwAll: true });
  return result;
}

/**
 * VIOLATION 3: Using throwError without try-catch
 * Should trigger ERROR - throws ValidationError
 */
async function violationThrowErrorNoTryCatch(instance: unknown) {
  const v = new Validator();
  const schema = { type: 'string' };

  // ❌ No try-catch - will throw ValidationError immediately
  const result = v.validate(instance, schema, { throwError: true });
  return result;
}

/**
 * VIOLATION 4: addSchema without try-catch
 * Should trigger ERROR - can throw SchemaError
 */
function violationAddSchemaNoTryCatch(schema: object) {
  const v = new Validator();

  // ❌ No try-catch - will throw if schema is invalid or undefined
  v.addSchema(schema, '/MySchema');
  return v;
}

/**
 * VIOLATION 5: Multiple throwing operations without error handling
 * Should trigger multiple ERRORs
 */
function violationMultipleThrowingOps(data: unknown, customSchema: object) {
  const v = new Validator();

  // ❌ No try-catch for addSchema
  v.addSchema(customSchema, '/Custom');

  // ❌ No try-catch for validate with throwFirst
  const result = v.validate(data, { $ref: '/Custom' }, { throwFirst: true });

  return result;
}

/**
 * VIOLATION 6: Default mode without result checking
 * NOTE: Analyzer CANNOT detect this (return-value pattern)
 * This is documented but not enforced by current analyzer
 */
function violationNoResultCheck(data: unknown) {
  const schema = { type: 'number' };

  // ❌ No result.valid check - invalid data will pass silently
  const result = validate(data, schema);

  // Directly using data without checking result.valid
  return data;
}

/**
 * VIOLATION 7: Ignoring validation errors
 * NOTE: Analyzer CANNOT detect this (return-value pattern)
 */
function violationIgnoreErrors(userData: unknown) {
  const v = new Validator();
  const schema = {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' }
    }
  };

  // ❌ result.errors is never checked
  const result = v.validate(userData, schema);

  // Assuming validation passed without checking
  return userData;
}

/**
 * VIOLATION 8: throwFirst in async context without await/try-catch
 * Should trigger ERROR
 */
async function violationAsyncThrowFirst(data: unknown) {
  const schema = { type: 'object' };

  // ❌ No try-catch in async function
  const result = validate(data, schema, { throwFirst: true });

  return result;
}

/**
 * VIOLATION 9: Chained operations with throwing options
 * Should trigger ERROR
 */
function violationChainedOps(data1: unknown, data2: unknown) {
  const v = new Validator();
  const schema = { type: 'string' };

  // ❌ No try-catch for either validation
  const result1 = v.validate(data1, schema, { throwError: true });
  const result2 = v.validate(data2, schema, { throwError: true });

  return { result1, result2 };
}

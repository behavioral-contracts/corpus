/**
 * Instance-based usage patterns for jsonschema
 * Testing Validator class instantiation and method calls
 */

import { Validator } from 'jsonschema';

/**
 * VIOLATION: Validator instance with throwFirst, no try-catch
 * Should trigger ERROR
 */
class SchemaValidator {
  private validator: Validator;

  constructor() {
    this.validator = new Validator();
  }

  // ❌ No try-catch when using throwFirst option
  validateStrict(data: unknown, schema: object) {
    return this.validator.validate(data, schema, { throwFirst: true });
  }

  // ❌ No try-catch when adding schema
  registerSchema(schema: object, id: string) {
    this.validator.addSchema(schema, id);
  }

  // ❌ No try-catch with throwAll option
  validateAll(data: unknown, schema: object) {
    return this.validator.validate(data, schema, { throwAll: true });
  }
}

/**
 * PROPER: Validator instance with proper error handling
 * Should NOT trigger violations
 */
class SafeSchemaValidator {
  private validator: Validator;

  constructor() {
    this.validator = new Validator();
  }

  // ✅ Proper try-catch
  validateStrict(data: unknown, schema: object) {
    try {
      return this.validator.validate(data, schema, { throwFirst: true });
    } catch (error) {
      console.error('Validation failed:', error);
      return null;
    }
  }

  // ✅ Proper try-catch for addSchema
  registerSchema(schema: object, id: string) {
    try {
      this.validator.addSchema(schema, id);
      return true;
    } catch (error) {
      console.error('Failed to register schema:', error);
      return false;
    }
  }

  // ✅ Result checking for default mode
  validateSafe(data: unknown, schema: object) {
    const result = this.validator.validate(data, schema);

    if (!result.valid) {
      console.error('Validation errors:', result.errors);
      return null;
    }

    return result;
  }
}

/**
 * VIOLATION: Factory pattern without error handling
 * Should trigger ERROR
 */
function createValidator() {
  const v = new Validator();

  // ❌ No try-catch when adding schemas
  v.addSchema({ id: '/User', type: 'object' }, '/User');
  v.addSchema({ id: '/Post', type: 'object' }, '/Post');

  return v;
}

/**
 * VIOLATION: Method chaining with throwing options
 * Should trigger ERROR
 */
function validateMultiple(data: unknown[]) {
  const v = new Validator();
  const schema = { type: 'string' };

  // ❌ No try-catch for multiple validations with throwError
  return data.map(item => v.validate(item, schema, { throwError: true }));
}

/**
 * PROPER: Method chaining with error handling
 * Should NOT trigger violations
 */
function validateMultipleSafe(data: unknown[]) {
  const v = new Validator();
  const schema = { type: 'string' };

  return data.map(item => {
    try {
      return v.validate(item, schema, { throwError: true });
    } catch (error) {
      console.error('Item validation failed:', error);
      return null;
    }
  });
}

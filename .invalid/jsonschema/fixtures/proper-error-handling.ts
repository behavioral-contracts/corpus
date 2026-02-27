/**
 * PROPER error handling patterns for jsonschema package
 * These examples should NOT trigger violations
 */

import { Validator, validate } from 'jsonschema';

/**
 * Pattern 1: Using throwFirst option with try-catch
 * CORRECT - try-catch present for throwing option
 */
async function validateWithThrowFirst(data: unknown) {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' }
    },
    required: ['name']
  };

  try {
    const result = validate(data, schema, { throwFirst: true });
    console.log('Validation passed:', result.valid);
    return result;
  } catch (error) {
    console.error('Validation failed:', error);
    throw error;
  }
}

/**
 * Pattern 2: Using throwAll option with try-catch
 * CORRECT - try-catch present for throwing option
 */
function validateWithThrowAll(data: unknown, schema: object) {
  const v = new Validator();

  try {
    const result = v.validate(data, schema, { throwAll: true });
    return result;
  } catch (error) {
    console.error('Multiple validation errors:', error);
    return null;
  }
}

/**
 * Pattern 3: Using throwError option with try-catch
 * CORRECT - try-catch present for throwing option
 */
function validateWithThrowError(instance: unknown, schema: object) {
  try {
    const v = new Validator();
    const result = v.validate(instance, schema, { throwError: true });
    return result;
  } catch (error) {
    console.error('Validation error:', error);
    throw new Error('Invalid data');
  }
}

/**
 * Pattern 4: Default mode with result checking
 * CORRECT - checking result.valid before using data
 */
function validateWithResultCheck(data: unknown) {
  const schema = {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' }
    }
  };

  const result = validate(data, schema);

  if (!result.valid) {
    console.error('Validation errors:', result.errors);
    throw new Error('Invalid email format');
  }

  // Safe to use data here
  return data;
}

/**
 * Pattern 5: Validator instance with result checking
 * CORRECT - checking result.valid and handling errors
 */
function validateUserData(userData: unknown) {
  const v = new Validator();
  const schema = {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 3 },
      password: { type: 'string', minLength: 8 }
    },
    required: ['username', 'password']
  };

  const result = v.validate(userData, schema);

  if (!result.valid) {
    result.errors.forEach(error => {
      console.error(`Validation error at ${error.property}: ${error.message}`);
    });
    return null;
  }

  return userData;
}

/**
 * Pattern 6: Adding schema with try-catch
 * CORRECT - try-catch for addSchema which can throw
 */
function addSchemaWithErrorHandling(schema: object, id: string) {
  const v = new Validator();

  try {
    v.addSchema(schema, id);
    console.log('Schema added successfully');
  } catch (error) {
    console.error('Failed to add schema:', error);
    throw new Error('Invalid schema definition');
  }
}

/**
 * Pattern 7: Multiple validations with proper error handling
 * CORRECT - both try-catch and result checking
 */
async function complexValidation(data: unknown) {
  const v = new Validator();

  // Add schema with error handling
  try {
    v.addSchema({
      id: '/Address',
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' }
      }
    }, '/Address');
  } catch (error) {
    console.error('Schema error:', error);
    return false;
  }

  // Validate with throwFirst option
  try {
    const result = v.validate(data, {
      type: 'object',
      properties: {
        address: { $ref: '/Address' }
      }
    }, { throwFirst: true });

    return result.valid;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

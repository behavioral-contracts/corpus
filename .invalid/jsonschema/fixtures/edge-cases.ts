/**
 * Edge cases and return-value patterns for jsonschema
 * Testing default mode behavior and analyzer limitations
 */

import { Validator, validate } from 'jsonschema';

/**
 * ANALYZER LIMITATION: Default mode without result checking
 * Analyzer CANNOT detect this violation (return-value pattern)
 *
 * These cases show why detection rate is low for jsonschema
 */

/**
 * Edge Case 1: Default validation without checking result
 * Analyzer CANNOT detect - no try-catch needed, should check result.valid
 */
function edgeCaseDefaultMode(data: unknown) {
  const schema = { type: 'string', minLength: 5 };

  // ❌ Missing result.valid check - analyzer cannot detect this
  const result = validate(data, schema);

  // Data is used without validation - silent failure possible
  return data;
}

/**
 * Edge Case 2: Validator instance default mode
 * Analyzer CANNOT detect - no exception thrown
 */
function edgeCaseValidatorDefault(data: unknown) {
  const v = new Validator();
  const schema = {
    type: 'object',
    properties: {
      age: { type: 'number', minimum: 0 }
    }
  };

  // ❌ Missing result.valid check - analyzer cannot detect this
  const result = v.validate(data, schema);

  // Assuming validation passed
  return data;
}

/**
 * Edge Case 3: Nested validation without proper checks
 * Analyzer CANNOT detect - return-value pattern
 */
function edgeCaseNestedValidation(user: unknown) {
  const v = new Validator();

  const addressSchema = {
    type: 'object',
    properties: {
      street: { type: 'string' },
      zip: { type: 'string', pattern: '^[0-9]{5}$' }
    }
  };

  const userSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      address: addressSchema
    }
  };

  // ❌ Missing result.valid check - analyzer cannot detect
  const result = v.validate(user, userSchema);

  // Data assumed valid
  return user;
}

/**
 * Edge Case 4: Mixing throwing and non-throwing modes
 * Analyzer CAN detect the throwing part only
 */
function edgeCaseMixedModes(data1: unknown, data2: unknown) {
  const v = new Validator();
  const schema = { type: 'number' };

  // ❌ Analyzer can detect this - throwError without try-catch
  const result1 = v.validate(data1, schema, { throwError: true });

  // ❌ Analyzer CANNOT detect this - missing result.valid check
  const result2 = v.validate(data2, schema);

  return { result1, result2 };
}

/**
 * Edge Case 5: Conditional throwing mode
 * Complex pattern - partial detection
 */
function edgeCaseConditionalThrow(data: unknown, strict: boolean) {
  const schema = { type: 'object' };

  if (strict) {
    // ❌ Analyzer can detect - throwFirst without try-catch
    const result = validate(data, schema, { throwFirst: true });
    return result;
  } else {
    // ❌ Analyzer CANNOT detect - missing result.valid check
    const result = validate(data, schema);
    return result;
  }
}

/**
 * Edge Case 6: Custom format validation without checks
 * Analyzer CANNOT detect - return-value pattern
 */
function edgeCaseCustomFormat(email: unknown) {
  const v = new Validator();

  v.customFormats.email = (input: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const schema = {
    type: 'string',
    format: 'email'
  };

  // ❌ Missing result.valid check - analyzer cannot detect
  const result = v.validate(email, schema);

  return email;
}

/**
 * Edge Case 7: Optional error handling with nestedErrors
 * Analyzer CANNOT detect - return-value with options
 */
function edgeCaseNestedErrors(data: unknown) {
  const v = new Validator();

  const schema = {
    oneOf: [
      { type: 'string' },
      { type: 'number' }
    ]
  };

  // ❌ Missing result.valid check - analyzer cannot detect
  // nestedErrors option doesn't change throwing behavior
  const result = v.validate(data, schema, { nestedErrors: true });

  return data;
}

/**
 * Edge Case 8: Required option without validation
 * Analyzer CANNOT detect - return-value pattern
 */
function edgeCaseRequiredOption(data: undefined) {
  const schema = { type: 'string' };

  // ❌ Missing result.valid check - analyzer cannot detect
  // required: true makes undefined invalid, but doesn't throw
  const result = validate(data, schema, { required: true });

  return data;
}

/**
 * PROPER: Edge cases with proper handling
 * These show the correct patterns for comparison
 */

/**
 * Proper: Default mode with result checking
 */
function properEdgeCaseDefault(data: unknown) {
  const schema = { type: 'string' };

  const result = validate(data, schema);

  // ✅ Checking result.valid
  if (!result.valid) {
    console.error('Validation failed:', result.errors);
    return null;
  }

  return data;
}

/**
 * Proper: Conditional throwing with error handling
 */
function properEdgeCaseConditional(data: unknown, strict: boolean) {
  const schema = { type: 'object' };

  if (strict) {
    // ✅ try-catch for throwing mode
    try {
      return validate(data, schema, { throwFirst: true });
    } catch (error) {
      console.error('Strict validation failed:', error);
      return null;
    }
  } else {
    // ✅ result.valid check for default mode
    const result = validate(data, schema);
    if (!result.valid) {
      console.error('Validation failed:', result.errors);
      return null;
    }
    return result;
  }
}

/**
 * Proper: Custom format with validation
 */
function properEdgeCaseCustomFormat(email: unknown) {
  const v = new Validator();

  v.customFormats.email = (input: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const schema = {
    type: 'string',
    format: 'email'
  };

  const result = v.validate(email, schema);

  // ✅ Checking result and errors
  if (!result.valid) {
    result.errors.forEach(err => {
      console.error(`Invalid email: ${err.message}`);
    });
    return null;
  }

  return email;
}

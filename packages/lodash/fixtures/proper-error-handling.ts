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

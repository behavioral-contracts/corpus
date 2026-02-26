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

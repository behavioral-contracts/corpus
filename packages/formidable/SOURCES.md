# Sources: formidable

## Official Documentation

- **npm Package**: [formidable](https://www.npmjs.com/package/formidable)
- **GitHub Repository**: [node-formidable/formidable](https://github.com/node-formidable/formidable)
- **Complete Guide 2025**: [Formidable Guide](https://generalistprogrammer.com/tutorials/formidable-npm-package-guide)
- **Code Examples**: [Snyk Advisor](https://snyk.io/advisor/npm-package/formidable/example)

## Error Handling Patterns

**Promise-based** (recommended): Use try-catch blocks
**Callback-based**: Use error parameter in callback

Common errors include:
- File size limit exceeded (maxFieldsExceeded)
- Invalid file type
- Parsing errors
- I/O errors during file upload

Errors have `code` and `httpCode` properties for easier handling.

## Contract Rationale

**Postcondition formidable-001**: Form parsing involves I/O operations that can fail due to invalid data, size limits, or file system errors. Unhandled exceptions will crash Node.js applications. The official documentation recommends using try-catch for promise-based parsing.

## Research Date

2026-02-26

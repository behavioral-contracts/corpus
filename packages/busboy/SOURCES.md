# Sources: busboy

## Official Documentation

- **npm Package**: [busboy](https://www.npmjs.com/package/busboy)
- **GitHub Repository**: [fastify/busboy](https://github.com/fastify/busboy)
- **Complete Guide 2025**: [Busboy Guide](https://generalistprogrammer.com/tutorials/busboy-npm-package-guide)
- **Tutorial**: [Busboy File Uploads](https://spin.atomicobject.com/busboy-express-middleware/)

## Error Handling Patterns

Busboy is event-based and requires error event listeners:
- `busboy.on('error', callback)` - handle parsing errors
- `file.on('limit', callback)` - handle file size limit exceeded
- `busboy.on('partsLimit', callback)` - handle parts limit
- `busboy.on('filesLimit', callback)` - handle files limit
- `busboy.on('fieldsLimit', callback)` - handle fields limit

Common errors include:
- Invalid multipart data
- File size limits exceeded
- Stream errors

## Contract Rationale

**Postcondition busboy-001**: Busboy parses streaming multipart data which can fail due to invalid input, size limits, or stream errors. Without error handlers, these errors will crash Node.js applications. The event-based API requires explicit error handling.

## Research Date

2026-02-26

# Sources: archiver

## Official Documentation

- **npm Package**: [archiver](https://www.npmjs.com/package/archiver)
- **GitHub Repository**: [archiverjs/node-archiver](https://github.com/archiverjs/node-archiver)
- **Code Examples**: [Snyk Advisor](https://snyk.io/advisor/npm-package/archiver/example)
- **Code Examples**: [Tabnine](https://www.tabnine.com/code/javascript/functions/archiver/Archiver/on)

## Error Handling Patterns

Archiver is event-based and requires event listeners:
- `archive.on('error', callback)` - handle critical errors
- `archive.on('warning', callback)` - handle non-blocking warnings (e.g., ENOENT)

Common errors include:
- File not found (ENOENT) - handled as warning
- I/O errors during file reading
- Compression errors
- Stream errors

## Contract Rationale

**Postcondition archiver-001**: Archive creation involves file I/O operations that can fail due to missing files, permission errors, or stream errors. Without error and warning handlers, these errors will crash Node.js applications. The official documentation explicitly requires error and warning event handlers.

## Research Date

2026-02-26

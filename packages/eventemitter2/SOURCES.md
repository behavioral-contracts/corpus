# Sources: eventemitter2

## Official Documentation

- **npm Package**: [eventemitter2](https://www.npmjs.com/package/eventemitter2)
- **Code Examples**: [Snyk Advisor](https://snyk.io/advisor/npm-package/eventemitter2/example)
- **Tutorial**: [IronPDF EventEmitter2 Guide](https://ironpdf.com/nodejs/blog/node-help/eventemitter2-npm/)
- **Medium Tutorial**: [Using EventEmitter in Node.js](https://medium.com/heroic-engineering/using-eventemitter-in-nodejs-5265522e8705)

## Error Handling Patterns

EventEmitter2 supports:
- `ignoreErrors: false` option to disable throwing uncaughtException
- `waitFor()` with `handleError: true` to reject promises on error events
- Standard error event emission pattern

Common patterns:
- `emitter.on('error', callback)` - handle error events
- `waitFor('event', { handleError: true })` - reject promise on errors

## Contract Rationale

**Postcondition eventemitter2-001**: EventEmitter2 instances that emit error events will throw uncaught exceptions if no error listener is attached (unless ignoreErrors is configured). This can crash Node.js applications. Error listeners are essential for proper error handling in event-driven code.

## Research Date

2026-02-26

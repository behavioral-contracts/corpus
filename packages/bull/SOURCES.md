# Sources: bull

## Official Documentation

- **npm Package**: [bull](https://www.npmjs.com/package/bull)
- **Official Guide**: [Bull's Guide](https://optimalbits.github.io/bull/)
- **GitHub Repository**: [OptimalBits/bull](https://github.com/OptimalBits/bull)
- **Tutorial**: [Asynchronous task processing with Bull](https://blog.logrocket.com/asynchronous-task-processing-in-node-js-with-bull/)
- **Neon Guide**: [Job Queue System with Bull](https://neon.com/guides/nodejs-queue-system)

## Error Handling Patterns

Bull provides error handling through:
- **Job processor errors**: Call `done(error)` or use try-catch in async processors
- **Event listeners**:
  - `queue.on('failed', (job, err) => {})` - handle failed jobs
  - `queue.on('stalled', (job) => {})` - handle stalled jobs (critical!)
  - `queue.on('error', (error) => {})` - handle queue errors

Common errors include:
- Job processing errors
- Connection errors (Redis)
- Stalled jobs (event loop blocked)
- Job timeout errors

## Important Note

Bull is in maintenance mode. For new projects, consider BullMQ (TypeScript rewrite with new features).

## Contract Rationale

**Postcondition bull-001**: Bull job processors perform async operations that can fail. Unhandled errors in processors can cause jobs to stall or be reprocessed incorrectly. The documentation emphasizes the importance of error handling and listening to the 'stalled' event for monitoring.

## Research Date

2026-02-26

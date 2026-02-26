# Sources: bcryptjs

## Official Documentation
- npm: https://www.npmjs.com/package/bcryptjs
- GitHub: https://github.com/dcodeIO/bcrypt.js

## Behavioral Evidence

### Promise Rejection
The `hash()` and `compare()` methods return promises that can reject on errors:
- Invalid salt rounds
- Internal hashing failures
- Comparison failures

Reference: Package README and source code.

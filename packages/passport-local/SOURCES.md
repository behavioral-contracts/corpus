# Sources: passport-local

## Official Documentation

- **npm Package**: [passport-local](https://www.npmjs.com/package/passport-local)
- **Official Website**: [passport-local](https://www.passportjs.org/packages/passport-local/)
- **GitHub Repository**: [jaredhanson/passport-local](https://github.com/jaredhanson/passport-local)
- **Complete Guide 2025**: [Passport-local Guide](https://generalistprogrammer.com/tutorials/passport-local-npm-package-guide)

## Error Handling Patterns

The verify callback uses the done callback for error handling:
- **Success**: `done(null, user)` - user authenticated successfully
- **Failure**: `done(null, false)` - authentication failed (wrong credentials)
- **Error**: `done(err)` - database or system error occurred

Common errors include:
- Database connection failures during user lookup
- User not found errors
- Password comparison errors

## Contract Rationale

**Postcondition passport-local-001**: The verify callback performs database operations that can fail. Unhandled errors in the callback will crash the Node.js application. The done callback provides the standard Passport error handling mechanism.

## Research Date

2026-02-26

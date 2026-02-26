# Sources: lodash

## Official Documentation
- npm: https://www.npmjs.com/package/lodash
- Website: https://lodash.com/docs/
- GitHub: https://github.com/lodash/lodash

## Behavioral Evidence

### Throwing Methods
- `_.template()` can throw SyntaxError on invalid template strings
- Most lodash methods do not throw, but `_.template()` is an exception

Reference: Official API documentation for _.template().

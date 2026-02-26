# Sources: minio

## Official Documentation

- **MinIO JavaScript Client SDK**: [GitHub - minio/minio-js](https://github.com/minio/minio-js)
- **npm Package**: [minio](https://www.npmjs.com/package/minio)
- **JavaScript Client API Reference**: [AIStor Docs](https://docs.min.io/enterprise/aistor-object-store/developers/sdk/javascript/api/)
- **API Documentation**: [GitHub API.md](https://raw.githubusercontent.com/minio/minio-js/master/docs/API.md)

## Error Handling Patterns

The MinIO client supports both promise-based (recommended) and callback-based error handling:

**Promise-based** (recommended): Use try-catch blocks
**Callback-based**: Check for null `err` parameter
**Stream-based**: Use `stream.on('error', callback)`

Common errors include:
- Connection failures
- Authentication errors (invalid access/secret key)
- Bucket not found
- Object not found
- Permission errors
- Network errors

## Contract Rationale

**Postcondition minio-001**: MinIO operations can fail due to network issues, authentication problems, or S3 API errors. Unhandled exceptions will crash Node.js applications. The official documentation recommends using try-catch for promise-based operations.

## Research Date

2026-02-26

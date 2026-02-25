# Sources for @aws-sdk/client-s3 Behavioral Contract

**Package:** @aws-sdk/client-s3
**Contract Version:** 1.0.0
**Research Date:** 2026-02-25
**Semver Range:** ^3.0.0

---

## Official Documentation

### AWS SDK for JavaScript v3 Documentation
- **URL:** https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/
- **Key Information:** S3Client operations, command patterns, error types

### AWS S3 API Error Responses
- **URL:** https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html
- **Key Information:** Complete error code catalog (NoSuchKey, AccessDenied, SlowDown, etc.)

###AWS SDK v3 Error Handling Guide
- **URL:** https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/ERROR_HANDLING.md
- **Key Information:** TypeScript error handling patterns, S3ServiceException usage

## Error Types Reference

### Critical Errors (ERROR severity)
- `NoSuchKey` (404): Object doesn't exist
- `NoSuchBucket` (404): Bucket doesn't exist
- `AccessDenied` (403): Insufficient permissions
- `NoSuchUpload` (404): Invalid multipart upload ID
- `EntityTooSmall` (400): Part too small in multipart upload
- `BucketNotEmpty` (409): Cannot delete non-empty bucket

### Warning Errors (WARNING severity)
- `InvalidArgument` (400): Invalid request parameters
- `BucketAlreadyExists` (409): Bucket name taken

### Info Errors (INFO severity)
- `SlowDown` (503): Rate limiting
- `ServiceUnavailable` (503): Temporary AWS issue

---

## Sources

- [Error Handling in Modular AWS SDK for JavaScript (v3)](https://aws.amazon.com/blogs/developer/service-error-handling-modular-aws-sdk-js/)
- [Best Practices for Error Handling and Retries with AWS S3 SDK](https://reintech.io/blog/best-practices-error-handling-retries-aws-s3-sdk)
- [aws-sdk/client-s3 npm package](https://www.npmjs.com/package/@aws-sdk/client-s3)
- [AWS SDK JS v3 Error Handling Guide](https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/ERROR_HANDLING.md)

---

**Contract Author:** Claude Sonnet 4.5
**Verification Status:** Phase 3 Complete (Implementation)
**Next Phase:** Phase 4 (Analyzer Check)

# Sources: nodemailer

## Official Documentation
- npm: https://www.npmjs.com/package/nodemailer
- Website: https://nodemailer.com/
- GitHub: https://github.com/nodemailer/nodemailer

## Behavioral Evidence

### Promise Rejection in sendMail()
The `sendMail()` method returns a promise that can reject on:
- SMTP errors
- Authentication failures
- Network issues
- Invalid email addresses

Reference: Official documentation on error handling.

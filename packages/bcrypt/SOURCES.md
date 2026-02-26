# Sources: bcrypt

**Package:** `bcrypt`
**Version:** 5.x, 6.x
**Category:** security (Password hashing)
**Status:** ✅ Complete

---

## Official Documentation

- **Main Docs:** https://github.com/kelektiv/node.bcrypt.js#readme
- **Usage:** https://github.com/kelektiv/node.bcrypt.js#usage
- **API:** https://github.com/kelektiv/node.bcrypt.js#api
- **Security:** https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns
- **Timing Attacks:** https://github.com/kelektiv/node.bcrypt.js#a-note-on-timing-attacks
- **npm:** https://www.npmjs.com/package/bcrypt

## Behavioral Requirements

**Hashing Errors:** Invalid inputs, salt generation failures throw errors
**Comparison Errors:** Malformed hashes cause compare() to throw
**Must wrap hash() and compare() in try-catch**
**MUST use compare() instead of manual comparison** → prevents timing attacks

## Contract Rationale

**Timing attack vulnerability:** Manual string comparison leaks information through timing

**Hash/compare can fail:** Invalid inputs, corrupted hashes, system entropy issues

**Salt generation can fail:** Low system entropy can cause genSalt() failures

**Created:** 2026-02-26
**Status:** ✅ COMPLETE

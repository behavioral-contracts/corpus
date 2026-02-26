# Sources: dotenv

**Package:** `dotenv`
**Version:** 16.x, 17.x
**Category:** configuration (Environment variable loading)
**Status:** ✅ Complete

---

## Official Documentation

- **Main Docs:** https://github.com/motdotla/dotenv#readme
- **Usage:** https://github.com/motdotla/dotenv#usage
- **parse():** https://github.com/motdotla/dotenv#parse
- **FAQ:** https://github.com/motdotla/dotenv#faq
- **npm:** https://www.npmjs.com/package/dotenv

## Behavioral Requirements

**File Reading Errors:** Missing .env file returns {error} object
**Parsing Errors:** Malformed .env content throws SyntaxError in parse()
**Must check config().error to detect file read/parse failures**
**Must validate required env vars exist after loading**

## Contract Rationale

**Missing .env file is silent failure:** config() doesn't throw, returns {error}
**Undefined env vars cause runtime crashes** → accessing process.env.MISSING_VAR
**Malformed .env throws in parse()** → crashes application
**Production apps must validate required vars** → fail fast on startup

**Created:** 2026-02-26
**Status:** ✅ COMPLETE

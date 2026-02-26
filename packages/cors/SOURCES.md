# Sources: cors

**Package:** `cors`
**Version:** 2.x
**Category:** middleware (CORS handling)
**Status:** ✅ Complete

---

## Official Documentation

- **Main Docs:** https://github.com/expressjs/cors#readme
- **Configuration:** https://github.com/expressjs/cors#configuration-options
- **Examples:** https://github.com/expressjs/cors#enabling-cors-pre-flight
- **npm:** https://www.npmjs.com/package/cors

## Behavioral Requirements

**Origin Configuration:** Wildcard (*) with credentials not allowed by browsers
**Credentials Handling:** Must explicitly configure credentials
**Origin wildcard in production is insecure**
**Default CORS too permissive** for production

## Contract Rationale

**Wildcard origin + credentials = security issue:** Browsers reject this combination
**Production needs explicit origin list:** Prevents unauthorized cross-origin access
**Misconfiguration common:** Developers often use wildcard in production

**Created:** 2026-02-26
**Status:** ✅ COMPLETE

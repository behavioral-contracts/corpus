# Sources: helmet

**Package:** `helmet`
**Version:** 7.x, 8.x
**Category:** security (HTTP security headers)
**Status:** ✅ Complete

---

## Official Documentation

- **Main Docs:** https://helmetjs.github.io/
- **CSP:** https://helmetjs.github.io/#content-security-policy
- **All Middleware:** https://helmetjs.github.io/#reference
- **GitHub:** https://github.com/helmetjs/helmet
- **npm:** https://www.npmjs.com/package/helmet

## Behavioral Requirements

**Security Headers:** Sets 15 different security headers
**CSP Configuration:** Content-Security-Policy prevents XSS
**Should be applied early** in middleware chain
**Default settings may be too permissive** for specific apps

## Contract Rationale

**Security headers must be set first:** Before other middleware processes requests
**CSP is critical for XSS prevention:** Restricts script sources
**Helmet is middleware:** Errors rare but configuration matters

**Created:** 2026-02-26
**Status:** ✅ COMPLETE

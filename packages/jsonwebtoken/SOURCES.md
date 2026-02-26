# Sources: jsonwebtoken

**Package:** `jsonwebtoken`
**Version:** 9.x
**Category:** authentication (JWT token handling)
**Status:** ✅ Complete
**CVE:** CVE-2015-9235 (Algorithm Confusion Attack)

---

## Official Documentation

- **Main Docs:** https://github.com/auth0/node-jsonwebtoken#readme
- **verify():** https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
- **sign():** https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
- **decode():** https://github.com/auth0/node-jsonwebtoken#jwtdecodetoken--options
- **npm:** https://www.npmjs.com/package/jsonwebtoken

## Security Advisories

- **CVE-2015-9235:** https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-9235
- **Auth0 Blog:** https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/
- **Algorithm Confusion:** Attacker switches RS256 to HS256, signs with public key

## Behavioral Requirements

**Token Verification Errors:** JsonWebTokenError, TokenExpiredError, NotBeforeError
**Must wrap verify() in try-catch for error handling**
**MUST specify algorithms option in verify() to prevent CVE-2015-9235**
**decode() does NOT verify signature** → only use for debugging

## Contract Rationale

**Algorithm confusion attack (CVE-2015-9235):** Without algorithms specified, attacker can forge tokens by switching from asymmetric (RS256) to symmetric (HS256) and signing with the public key

**Token verification throws errors:** Invalid signature, expired tokens, not-yet-valid tokens all throw

**decode() is unsafe for authentication:** Only parses token, doesn't validate

**Created:** 2026-02-26
**Status:** ✅ COMPLETE

# Sources: sharp

**Package:** sharp
**Category:** image-processing
**Last Updated:** 2026-02-26
**Status:** ✅ COMPLETE

---

## Official Documentation

- **Main Docs:** https://sharp.pixelplumbing.com/
- **API Reference:** https://sharp.pixelplumbing.com/api-constructor
- **Output Methods:** https://sharp.pixelplumbing.com/api-output
- **npm:** https://www.npmjs.com/package/sharp
- **GitHub:** https://github.com/lovell/sharp

---

## Behavioral Requirements

**Error Pattern:** Promise-based async operations that reject on errors

**Key Methods:**
- `toFile()` - Rejects on file system errors or invalid image data
- `toBuffer()` - Rejects on processing errors or invalid input

**Required Handling:** Always use try-catch or .catch() for Promise rejections

---

## Contract Rationale

Sharp methods return Promises that reject when:
- File system operations fail (ENOENT, EACCES, ENOMEM)
- Image data is invalid or corrupted
- Processing operations fail (unsupported format, memory limits)

Without proper error handling, these rejections cause application crashes.

---

**Created:** 2026-02-26
**Research:** `dev-notes/package-onboarding/sharp/.onboarding/research/`

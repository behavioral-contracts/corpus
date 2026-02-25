/**
 * Cloudinary Fixtures: Missing Error Handling
 *
 * This file demonstrates INCORRECT patterns (missing error handling).
 * Should produce 4 ERROR violations when analyzed.
 */

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'demo',
  api_key: 'demo-key',
  api_secret: 'demo-secret'
});

/**
 * ❌ VIOLATION: upload-missing-error-handling
 * Missing try-catch around upload()
 */
async function uploadWithoutErrorHandling(filePath: string) {
  const result = await cloudinary.uploader.upload(filePath);
  console.log('Upload result:', result.secure_url);
  return result;
}

/**
 * ❌ VIOLATION: upload-large-missing-error-handling
 * Missing error handling for large file upload
 */
async function uploadLargeWithoutErrorHandling(filePath: string) {
  const result = await cloudinary.uploader.upload_large(filePath, {
    chunk_size: 6000000
  });
  console.log('Large upload complete:', result.secure_url);
  return result;
}

/**
 * ❌ VIOLATION: upload-stream-missing-error-handling
 * Stream upload without error callback
 */
function uploadStreamNoErrorHandling(buffer: Buffer) {
  const uploadStream = cloudinary.uploader.upload_stream();
  uploadStream.end(buffer);
}

/**
 * ❌ VIOLATION: destroy-missing-error-handling
 * Missing try-catch for destroy operation
 */
async function deleteWithoutErrorHandling(publicId: string) {
  const result = await cloudinary.uploader.destroy(publicId);
  console.log('Deleted:', result);
  return result;
}

// Export for testing
export {
  uploadWithoutErrorHandling,
  uploadLargeWithoutErrorHandling,
  uploadStreamNoErrorHandling,
  deleteWithoutErrorHandling
};

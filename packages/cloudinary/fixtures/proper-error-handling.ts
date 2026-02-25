/**
 * Cloudinary Fixtures: Proper Error Handling
 *
 * This file demonstrates CORRECT error handling patterns for cloudinary v2 API.
 * Should produce 0 violations when analyzed.
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (required for all operations)
cloudinary.config({
  cloud_name: 'demo',
  api_key: 'demo-key',
  api_secret: 'demo-secret'
});

/**
 * ✅ CORRECT: upload() with try-catch (async/await pattern)
 */
async function uploadImageWithTryCatch(filePath: string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'uploads',
      resource_type: 'auto'
    });
    console.log('Upload successful:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

/**
 * ✅ CORRECT: upload() with callback error handling
 */
function uploadImageWithCallback(filePath: string, callback: (error: any, result: any) => void) {
  cloudinary.uploader.upload(filePath, (error, result) => {
    if (error) {
      console.error('Upload failed:', error);
      return callback(error, null);
    }
    console.log('Upload successful:', result.secure_url);
    callback(null, result);
  });
}

/**
 * ✅ CORRECT: upload_large() with try-catch
 */
async function uploadLargeFileWithTryCatch(filePath: string) {
  try {
    const result = await cloudinary.uploader.upload_large(filePath, {
      chunk_size: 6000000
    });
    console.log('Large file upload successful:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Large file upload failed:', error);
    throw error;
  }
}

/**
 * ✅ CORRECT: upload_stream() with error parameter in callback
 */
function uploadFromStream(buffer: Buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('Stream upload failed:', error);
          return reject(error);
        }
        console.log('Stream upload successful:', result.secure_url);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * ✅ CORRECT: destroy() with try-catch
 */
async function deleteImageWithTryCatch(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Delete successful:', result);
    return result;
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
}

// Export functions for testing
export {
  uploadImageWithTryCatch,
  uploadImageWithCallback,
  uploadLargeFileWithTryCatch,
  uploadFromStream,
  deleteImageWithTryCatch
};

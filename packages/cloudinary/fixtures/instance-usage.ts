/**
 * Cloudinary Fixtures: Instance Usage Patterns
 *
 * This file tests detection of cloudinary usage via destructured instances.
 * Should detect violations even when uploader is accessed via instance variables.
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'demo',
  api_key: 'demo-key',
  api_secret: 'demo-secret'
});

/**
 * ✅ CORRECT: Instance usage with proper error handling
 */
class CloudinaryService {
  private uploader = cloudinary.uploader;

  async uploadWithErrorHandling(filePath: string) {
    try {
      const result = await this.uploader.upload(filePath);
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  async uploadLargeWithErrorHandling(filePath: string) {
    try {
      const result = await this.uploader.upload_large(filePath, {
        chunk_size: 6000000
      });
      return result;
    } catch (error) {
      console.error('Large upload failed:', error);
      throw error;
    }
  }

  uploadStreamWithErrorHandling(buffer: Buffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = this.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
  }

  async deleteWithErrorHandling(publicId: string) {
    try {
      const result = await this.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  }
}

/**
 * ❌ VIOLATION: Instance usage WITHOUT error handling
 */
class CloudinaryServiceNoErrorHandling {
  private uploader = cloudinary.uploader;

  async uploadWithoutErrorHandling(filePath: string) {
    // upload-missing-error-handling
    const result = await this.uploader.upload(filePath);
    return result;
  }

  async uploadLargeWithoutErrorHandling(filePath: string) {
    // upload-large-missing-error-handling
    const result = await this.uploader.upload_large(filePath, {
      chunk_size: 6000000
    });
    return result;
  }

  uploadStreamWithoutErrorHandling(buffer: Buffer) {
    // upload-stream-missing-error-handling
    const uploadStream = this.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        // Not checking error
        console.log('Result:', result);
      }
    );
    uploadStream.end(buffer);
  }

  async deleteWithoutErrorHandling(publicId: string) {
    // destroy-missing-error-handling
    const result = await this.uploader.destroy(publicId);
    return result;
  }
}

/**
 * ✅ CORRECT: Destructured uploader with error handling
 */
const { uploader } = cloudinary;

async function destructuredUploadWithErrorHandling(filePath: string) {
  try {
    const result = await uploader.upload(filePath);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

/**
 * ❌ VIOLATION: Destructured uploader WITHOUT error handling
 */
async function destructuredUploadWithoutErrorHandling(filePath: string) {
  // upload-missing-error-handling
  const result = await uploader.upload(filePath);
  return result;
}

/**
 * ✅ CORRECT: Module-level instance with error handling
 */
const uploaderInstance = cloudinary.uploader;

async function moduleInstanceWithErrorHandling(filePath: string) {
  try {
    const result = await uploaderInstance.upload(filePath);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

/**
 * ❌ VIOLATION: Module-level instance WITHOUT error handling
 */
async function moduleInstanceWithoutErrorHandling(filePath: string) {
  // upload-missing-error-handling
  const result = await uploaderInstance.upload(filePath);
  return result;
}

/**
 * ✅ CORRECT: Function parameter instance with error handling
 */
async function uploadWithInjectedUploader(
  uploader: typeof cloudinary.uploader,
  filePath: string
) {
  try {
    const result = await uploader.upload(filePath);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

/**
 * ❌ VIOLATION: Function parameter instance WITHOUT error handling
 */
async function uploadWithInjectedUploaderNoErrorHandling(
  uploader: typeof cloudinary.uploader,
  filePath: string
) {
  // upload-missing-error-handling
  const result = await uploader.upload(filePath);
  return result;
}

/**
 * ✅ CORRECT: Mixed patterns with proper error handling
 */
class MixedPatternsService {
  private uploader = cloudinary.uploader;

  async uploadMultipleFiles(filePaths: string[]) {
    const results = [];
    const errors = [];

    for (const filePath of filePaths) {
      try {
        const result = await this.uploader.upload(filePath);
        results.push(result);
      } catch (error) {
        errors.push({ filePath, error });
      }
    }

    return { results, errors };
  }

  async uploadAndCleanup(filePath: string) {
    try {
      const result = await this.uploader.upload(filePath);

      // Simulate cleanup
      try {
        await this.uploader.destroy(result.public_id);
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }

      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}

/**
 * ❌ VIOLATION: Mixed patterns WITHOUT error handling
 */
class MixedPatternsNoErrorHandling {
  private uploader = cloudinary.uploader;

  async uploadMultipleFiles(filePaths: string[]) {
    const results = [];

    for (const filePath of filePaths) {
      // upload-missing-error-handling (repeated)
      const result = await this.uploader.upload(filePath);
      results.push(result);
    }

    return results;
  }

  async uploadAndCleanup(filePath: string) {
    // upload-missing-error-handling
    const result = await this.uploader.upload(filePath);

    // destroy-missing-error-handling
    await this.uploader.destroy(result.public_id);

    return result;
  }
}

// Export for testing
export {
  CloudinaryService,
  CloudinaryServiceNoErrorHandling,
  destructuredUploadWithErrorHandling,
  destructuredUploadWithoutErrorHandling,
  moduleInstanceWithErrorHandling,
  moduleInstanceWithoutErrorHandling,
  uploadWithInjectedUploader,
  uploadWithInjectedUploaderNoErrorHandling,
  MixedPatternsService,
  MixedPatternsNoErrorHandling
};

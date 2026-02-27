import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});

// Edge Case 1: Bucket Management Operations

// ❌ Missing error handling - bucket creation
async function createBucket(bucketName: string) {
  await minioClient.makeBucket(bucketName, 'us-east-1');
}

// ❌ Missing error handling - bucket deletion
async function deleteBucket(bucketName: string) {
  await minioClient.removeBucket(bucketName);
}

// ❌ Missing error handling - list all buckets
async function getAllBuckets() {
  const buckets = await minioClient.listBuckets();
  return buckets;
}

// Edge Case 2: Object Metadata Operations

// ❌ Missing error handling - get object stats
async function getObjectInfo(bucket: string, filename: string) {
  const stat = await minioClient.statObject(bucket, filename);
  return stat;
}

// ❌ Missing error handling - copy object
async function copyFile(sourceBucket: string, sourceFile: string, destBucket: string, destFile: string) {
  await minioClient.copyObject(destBucket, destFile, `/${sourceBucket}/${sourceFile}`);
}

// Edge Case 3: Bulk Operations

// ❌ Missing error handling - delete multiple objects
async function deleteMultipleFiles(bucket: string, filenames: string[]) {
  await minioClient.removeObjects(bucket, filenames);
}

// Edge Case 4: File System Operations

// ❌ Missing error handling - upload from file system
async function uploadFromFile(bucket: string, objectName: string, filePath: string) {
  await minioClient.fPutObject(bucket, objectName, filePath);
}

// ❌ Missing error handling - download to file system
async function downloadToFile(bucket: string, objectName: string, filePath: string) {
  await minioClient.fGetObject(bucket, objectName, filePath);
}

// Edge Case 5: Presigned URLs

// ❌ Missing error handling - generate presigned upload URL
async function getUploadUrl(bucket: string, objectName: string) {
  const url = await minioClient.presignedPutObject(bucket, objectName, 3600);
  return url;
}

// ❌ Missing error handling - generate presigned download URL
async function getDownloadUrl(bucket: string, objectName: string) {
  const url = await minioClient.presignedGetObject(bucket, objectName, 3600);
  return url;
}

// Edge Case 6: Policy Operations

// ❌ Missing error handling - set bucket policy
async function updateBucketPolicy(bucket: string, policy: string) {
  await minioClient.setBucketPolicy(bucket, policy);
}

// ❌ Missing error handling - get bucket policy
async function fetchBucketPolicy(bucket: string) {
  const policy = await minioClient.getBucketPolicy(bucket);
  return policy;
}

// Edge Case 7: Chained Operations (multiple awaits in sequence)

// ❌ Missing error handling - multiple operations without overall try-catch
async function uploadAndVerify(bucket: string, filename: string, data: Buffer) {
  await minioClient.putObject(bucket, filename, data);
  const stat = await minioClient.statObject(bucket, filename);
  return stat;
}

// Edge Case 8: Conditional Operations

// ⚠️ Partial error handling - try-catch only around one operation
async function uploadIfBucketExists(bucket: string, filename: string, data: Buffer) {
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      throw new Error('Bucket does not exist');
    }
  } catch (error) {
    console.error('Error checking bucket:', error);
    throw error;
  }

  // ❌ Missing error handling - putObject not wrapped
  await minioClient.putObject(bucket, filename, data);
}

// Edge Case 9: Stream-based operations (NOT DETECTABLE by analyzer)

// ❌ Missing error handler on stream - analyzer CANNOT detect this
async function downloadAsStream(bucket: string, filename: string) {
  const stream = await minioClient.getObject(bucket, filename);
  // Missing stream.on('error') handler - analyzer limitation
  stream.on('data', (chunk) => {
    console.log('Data chunk:', chunk.length);
  });
  stream.on('end', () => {
    console.log('Download complete');
  });
}

// ❌ Missing error handler on list stream - analyzer CANNOT detect this
async function listObjectsAsStream(bucket: string) {
  const stream = minioClient.listObjects(bucket, '', true);
  // Missing stream.on('error') handler - analyzer limitation
  stream.on('data', (obj) => {
    console.log('Object:', obj.name);
  });
  stream.on('end', () => {
    console.log('Listing complete');
  });
}

// Edge Case 10: Proper Error Handling Examples

// ✅ Proper error handling - should NOT trigger violation
async function safeUpload(bucket: string, filename: string, data: Buffer) {
  try {
    await minioClient.putObject(bucket, filename, data);
    return { success: true };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error };
  }
}

// ✅ Proper error handling with stream - includes error handler
async function safeDownloadStream(bucket: string, filename: string) {
  try {
    const stream = await minioClient.getObject(bucket, filename);
    stream.on('error', (err) => {
      console.error('Stream error:', err);
    });
    stream.on('data', (chunk) => {
      console.log('Data chunk:', chunk.length);
    });
    stream.on('end', () => {
      console.log('Download complete');
    });
  } catch (error) {
    console.error('Failed to get stream:', error);
    throw error;
  }
}

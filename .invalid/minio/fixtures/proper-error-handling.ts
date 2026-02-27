import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});

// ✅ Proper error handling - putObject
async function uploadObject() {
  try {
    await minioClient.putObject('mybucket', 'myobject', 'Hello World');
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// ✅ Proper error handling - fPutObject
async function uploadFile(bucket: string, objectName: string, filePath: string) {
  try {
    await minioClient.fPutObject(bucket, objectName, filePath);
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
}

// ✅ Proper error handling - removeObject
async function deleteObject() {
  try {
    await minioClient.removeObject('mybucket', 'myobject');
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
}

// ✅ Proper error handling - makeBucket
async function createBucket(bucketName: string) {
  try {
    await minioClient.makeBucket(bucketName, 'us-east-1');
  } catch (error) {
    console.error('Bucket creation failed:', error);
    throw error;
  }
}

// ✅ Proper error handling - bucketExists
async function checkBucketExists(bucketName: string) {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    return exists;
  } catch (error) {
    console.error('Bucket check failed:', error);
    throw error;
  }
}

// ✅ Proper error handling - listBuckets
async function listBuckets() {
  try {
    const buckets = await minioClient.listBuckets();
    return buckets;
  } catch (error) {
    console.error('List buckets failed:', error);
    throw error;
  }
}

// ✅ Proper error handling - statObject
async function getObjectStats(bucket: string, objectName: string) {
  try {
    const stat = await minioClient.statObject(bucket, objectName);
    return stat;
  } catch (error) {
    console.error('Get stats failed:', error);
    throw error;
  }
}

// ✅ Proper error handling - copyObject
async function copyObject(sourceBucket: string, sourceObject: string, destBucket: string, destObject: string) {
  try {
    await minioClient.copyObject(destBucket, destObject, `/${sourceBucket}/${sourceObject}`);
  } catch (error) {
    console.error('Copy failed:', error);
    throw error;
  }
}

// ✅ Proper error handling - presignedGetObject
async function getPresignedUrl(bucket: string, objectName: string) {
  try {
    const url = await minioClient.presignedGetObject(bucket, objectName, 3600);
    return url;
  } catch (error) {
    console.error('Presigned URL generation failed:', error);
    throw error;
  }
}

// ✅ Proper error handling - getObject with stream error handler
async function downloadObjectWithStreamHandler() {
  try {
    const stream = await minioClient.getObject('mybucket', 'myobject');

    // Proper stream error handling
    stream.on('error', (err) => {
      console.error('Stream error:', err);
    });

    stream.on('data', (chunk) => {
      console.log('Received chunk:', chunk.length);
    });

    stream.on('end', () => {
      console.log('Download complete');
    });
  } catch (error) {
    console.error('Download initiation failed:', error);
    throw error;
  }
}

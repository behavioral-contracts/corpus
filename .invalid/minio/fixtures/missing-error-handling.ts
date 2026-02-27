import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});

// ❌ Missing error handling - putObject - should trigger violation
async function uploadObject() {
  await minioClient.putObject('mybucket', 'myobject', 'Hello World');
}

// ❌ Missing error handling - fPutObject - should trigger violation
async function uploadFileFromDisk(filePath: string) {
  await minioClient.fPutObject('mybucket', 'myfile', filePath);
}

// ❌ Missing error handling - removeObject - should trigger violation
async function deleteObject() {
  await minioClient.removeObject('mybucket', 'myobject');
}

// ❌ Missing error handling - removeObjects - should trigger violation
async function deleteMultipleObjects(objectsList: string[]) {
  await minioClient.removeObjects('mybucket', objectsList);
}

// ❌ Missing error handling - makeBucket - should trigger violation
async function createBucket(bucketName: string) {
  await minioClient.makeBucket(bucketName, 'us-east-1');
}

// ❌ Missing error handling - removeBucket - should trigger violation
async function deleteBucket(bucketName: string) {
  await minioClient.removeBucket(bucketName);
}

// ❌ Missing error handling - bucketExists - should trigger violation
async function checkBucket(bucketName: string) {
  const exists = await minioClient.bucketExists(bucketName);
  return exists;
}

// ❌ Missing error handling - listBuckets - should trigger violation
async function listBuckets() {
  const buckets = await minioClient.listBuckets();
  return buckets;
}

// ❌ Missing error handling - statObject - should trigger violation
async function getObjectMetadata(bucket: string, objectName: string) {
  const stat = await minioClient.statObject(bucket, objectName);
  return stat;
}

// ❌ Missing error handling - fGetObject - should trigger violation
async function downloadFileToPath(bucket: string, objectName: string, filePath: string) {
  await minioClient.fGetObject(bucket, objectName, filePath);
}

// ❌ Missing error handling - copyObject - should trigger violation
async function copyObjectToNewLocation(sourceBucket: string, sourceObject: string, destBucket: string, destObject: string) {
  await minioClient.copyObject(destBucket, destObject, `/${sourceBucket}/${sourceObject}`);
}

// ❌ Missing error handling - presignedPutObject - should trigger violation
async function generateUploadUrl(bucket: string, objectName: string) {
  const url = await minioClient.presignedPutObject(bucket, objectName, 3600);
  return url;
}

// ❌ Missing error handling - presignedGetObject - should trigger violation
async function generateDownloadUrl(bucket: string, objectName: string) {
  const url = await minioClient.presignedGetObject(bucket, objectName, 3600);
  return url;
}

// ❌ Missing error handling - setBucketPolicy - should trigger violation
async function updateBucketPolicy(bucket: string, policy: string) {
  await minioClient.setBucketPolicy(bucket, policy);
}

// ❌ Missing error handling - getBucketPolicy - should trigger violation
async function fetchBucketPolicy(bucket: string) {
  const policy = await minioClient.getBucketPolicy(bucket);
  return policy;
}

// ❌ Missing error handling - chained operations - should trigger violation
async function uploadAndVerify(bucket: string, objectName: string, data: Buffer) {
  await minioClient.putObject(bucket, objectName, data);
  const stat = await minioClient.statObject(bucket, objectName);
  return stat;
}

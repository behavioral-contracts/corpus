/**
 * @aws-sdk/client-s3 Fixtures: MISSING Error Handling
 * Should trigger MULTIPLE ERROR violations.
 */

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });

/**
 * ❌ BAD: GetObject without error handling
 * Should trigger: missing-s3-error-handling violation
 */
async function getObjectNoErrorHandling() {
  const command = new GetObjectCommand({
    Bucket: 'my-bucket',
    Key: 'file.txt'
  });
  const response = await s3Client.send(command);
  return response.Body;
}

/**
 * ❌ BAD: PutObject without error handling
 * Should trigger: missing-s3-error-handling violation
 */
async function putObjectNoErrorHandling(data: Buffer) {
  const response = await s3Client.send(
    new PutObjectCommand({
      Bucket: 'my-bucket',
      Key: 'upload.txt',
      Body: data
    })
  );
  return response.ETag;
}

/**
 * ❌ BAD: DeleteObject without error handling
 * Should trigger: missing-s3-error-handling violation
 */
async function deleteObjectNoErrorHandling() {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: 'my-bucket',
      Key: 'file-to-delete.txt'
    })
  );
}

/**
 * ❌ BAD: Multipart upload without error handling
 * Should trigger: missing-multipart-error-handling violation
 */
async function multipartUploadNoErrorHandling(parts: Buffer[]): Promise<string> {
  const createResponse = await s3Client.send(
    new CreateMultipartUploadCommand({
      Bucket: 'my-bucket',
      Key: 'large-file.zip'
    })
  );
  const uploadId = createResponse.UploadId!;

  const uploadedParts = [];
  for (let i = 0; i < parts.length; i++) {
    const partResponse = await s3Client.send(
      new UploadPartCommand({
        Bucket: 'my-bucket',
        Key: 'large-file.zip',
        UploadId: uploadId,
        PartNumber: i + 1,
        Body: parts[i]
      })
    );
    uploadedParts.push({
      ETag: partResponse.ETag,
      PartNumber: i + 1
    });
  }

  const completeResponse = await s3Client.send(
    new CompleteMultipartUploadCommand({
      Bucket: 'my-bucket',
      Key: 'large-file.zip',
      UploadId: uploadId,
      MultipartUpload: { Parts: uploadedParts }
    })
  );

  return completeResponse.Location!;
}

/**
 * ❌ BAD: CreateBucket without error handling
 * Should trigger: missing-bucket-error-handling violation
 */
async function createBucketNoErrorHandling(bucketName: string) {
  await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
}

/**
 * ❌ BAD: DeleteBucket without error handling
 * Should trigger: missing-bucket-error-handling violation
 */
async function deleteBucketNoErrorHandling(bucketName: string) {
  await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
}

/**
 * ❌ BAD: ListObjects without error handling
 * Should trigger: missing-list-error-handling violation
 */
async function listObjectsNoErrorHandling() {
  const response = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: 'my-bucket',
      MaxKeys: 100
    })
  );
  return response.Contents || [];
}

/**
 * ❌ BAD: Multiple operations without error handling
 * Should trigger MULTIPLE violations
 */
async function multipleOperationsNoErrorHandling() {
  const getResponse = await s3Client.send(
    new GetObjectCommand({
      Bucket: 'my-bucket',
      Key: 'file1.txt'
    })
  );

  await s3Client.send(
    new PutObjectCommand({
      Bucket: 'my-bucket',
      Key: 'file2.txt',
      Body: Buffer.from('data')
    })
  );

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: 'my-bucket',
      Key: 'file3.txt'
    })
  );

  return getResponse.Body;
}

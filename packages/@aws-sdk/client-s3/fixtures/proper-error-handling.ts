/**
 * @aws-sdk/client-s3 Fixtures: PROPER Error Handling
 * Should NOT trigger any violations.
 */

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  CreateBucketCommand,
  ListObjectsV2Command,
  S3ServiceException
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-1',
  maxAttempts: 3,
  retryMode: 'adaptive'
});

/**
 * ✅ GOOD: GetObject with proper error handling
 */
async function getObjectWithErrorHandling() {
  try {
    const command = new GetObjectCommand({
      Bucket: 'my-bucket',
      Key: 'file.txt'
    });
    const response = await s3Client.send(command);
    return response.Body;
  } catch (error) {
    if (error instanceof S3ServiceException) {
      if (error.name === 'NoSuchKey') {
        console.error('Object not found');
      }
    }
    throw error;
  }
}

/**
 * ✅ GOOD: PutObject with proper error handling
 */
async function putObjectWithErrorHandling(data: Buffer) {
  try {
    const response = await s3Client.send(
      new PutObjectCommand({
        Bucket: 'my-bucket',
        Key: 'upload.txt',
        Body: data
      })
    );
    return response.ETag;
  } catch (error) {
    if (error instanceof S3ServiceException) {
      if (error.name === 'NoSuchBucket') {
        console.error('Bucket does not exist');
      }
    }
    throw error;
  }
}

/**
 * ✅ GOOD: DeleteObject with proper error handling
 */
async function deleteObjectWithErrorHandling() {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'my-bucket',
        Key: 'file-to-delete.txt'
      })
    );
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
}

/**
 * ✅ GOOD: Multipart upload with proper error handling and cleanup
 */
async function multipartUploadWithErrorHandling(parts: Buffer[]): Promise<string> {
  let uploadId: string | undefined;

  try {
    const createResponse = await s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: 'my-bucket',
        Key: 'large-file.zip'
      })
    );
    uploadId = createResponse.UploadId;

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
  } catch (error) {
    if (uploadId) {
      try {
        await s3Client.send(
          new AbortMultipartUploadCommand({
            Bucket: 'my-bucket',
            Key: 'large-file.zip',
            UploadId: uploadId
          })
        );
      } catch (abortError) {
        console.error('Failed to abort:', abortError);
      }
    }
    throw error;
  }
}

/**
 * ✅ GOOD: CreateBucket with proper error handling
 */
async function createBucketWithErrorHandling(bucketName: string) {
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
  } catch (error) {
    if (error instanceof S3ServiceException) {
      if (error.name === 'BucketAlreadyExists') {
        console.log('Bucket already exists');
        return;
      }
    }
    throw error;
  }
}

/**
 * ✅ GOOD: ListObjects with proper error handling
 */
async function listObjectsWithErrorHandling() {
  try {
    const response = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: 'my-bucket',
        MaxKeys: 100
      })
    );
    return response.Contents || [];
  } catch (error) {
    if (error instanceof S3ServiceException) {
      if (error.name === 'NoSuchBucket') {
        return [];
      }
    }
    throw error;
  }
}

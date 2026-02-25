/**
 * @aws-sdk/client-s3 Fixtures: Instance Usage Patterns
 * Tests detection of S3Client usage via class instances
 */

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';

/**
 * Pattern 1: Class with S3Client instance property
 */
class S3Service {
  private client: S3Client;

  constructor(region: string = 'us-east-1') {
    this.client = new S3Client({ region, maxAttempts: 3, retryMode: 'adaptive' });
  }

  /**
   * ❌ BAD: Instance method without error handling
   */
  async getObject(bucket: string, key: string) {
    const response = await this.client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    return response.Body;
  }

  /**
   * ✅ GOOD: Instance method with error handling
   */
  async getObjectSafe(bucket: string, key: string) {
    try {
      const response = await this.client.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );
      return response.Body;
    } catch (error) {
      console.error('Failed to get object:', error);
      throw error;
    }
  }

  /**
   * ❌ BAD: Multiple operations without error handling
   */
  async copyObject(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string) {
    const getResponse = await this.client.send(
      new GetObjectCommand({ Bucket: sourceBucket, Key: sourceKey })
    );

    await this.client.send(
      new PutObjectCommand({
        Bucket: destBucket,
        Key: destKey,
        Body: getResponse.Body
      })
    );
  }
}

/**
 * Pattern 2: Dependency injection
 */
class StorageRepository {
  constructor(private s3Client: S3Client) {}

  /**
   * ❌ BAD: Repository method without error handling
   */
  async upload(bucket: string, key: string, data: Buffer) {
    const response = await this.s3Client.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: data })
    );
    return response.ETag;
  }

  /**
   * ✅ GOOD: Repository method with error handling
   */
  async uploadSafe(bucket: string, key: string, data: Buffer) {
    try {
      const response = await this.s3Client.send(
        new PutObjectCommand({ Bucket: bucket, Key: key, Body: data })
      );
      return response.ETag;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}

/**
 * Pattern 3: Wrapper class with helper methods
 */
class S3Helper {
  constructor(private client: S3Client) {}

  /**
   * ❌ BAD: Helper without error handling
   */
  async listAllObjects(bucket: string) {
    let allObjects: any[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          ContinuationToken: continuationToken
        })
      );
      allObjects = allObjects.concat(response.Contents || []);
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return allObjects;
  }

  /**
   * ❌ BAD: Batch delete without error handling
   */
  async deleteMultipleObjects(bucket: string, keys: string[]) {
    for (const key of keys) {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: key })
      );
    }
  }
}

/**
 * Usage examples
 */
async function testInstancePatterns() {
  const service = new S3Service();
  await service.getObject('bucket', 'key'); // Should trigger violation
  await service.getObjectSafe('bucket', 'key'); // Should NOT trigger
  await service.copyObject('b1', 'k1', 'b2', 'k2'); // Multiple violations

  const repo = new StorageRepository(new S3Client({ region: 'us-east-1' }));
  await repo.upload('bucket', 'key', Buffer.from('data')); // Should trigger
  await repo.uploadSafe('bucket', 'key', Buffer.from('data')); // Should NOT trigger

  const helper = new S3Helper(new S3Client({ region: 'us-east-1' }));
  await helper.listAllObjects('bucket'); // Should trigger
  await helper.deleteMultipleObjects('bucket', ['k1', 'k2']); // Multiple violations
}

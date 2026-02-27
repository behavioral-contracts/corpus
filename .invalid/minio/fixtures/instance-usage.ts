import * as Minio from 'minio';

// Instance-based usage pattern
class StorageService {
  private client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: 'play.min.io',
      port: 9000,
      useSSL: true,
      accessKey: 'Q3AM3UQ867SPQQA43P2F',
      secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
    });
  }

  // ❌ Missing error handling - should trigger violation
  async uploadFile(bucket: string, filename: string, data: Buffer) {
    await this.client.putObject(bucket, filename, data);
  }

  // ❌ Missing error handling - should trigger violation
  async deleteFile(bucket: string, filename: string) {
    await this.client.removeObject(bucket, filename);
  }

  // ❌ Missing error handling - should trigger violation
  async checkBucket(bucket: string) {
    const exists = await this.client.bucketExists(bucket);
    return exists;
  }

  // ✅ Proper error handling - should NOT trigger violation
  async createBucket(bucket: string) {
    try {
      await this.client.makeBucket(bucket, 'us-east-1');
    } catch (error) {
      console.error('Failed to create bucket:', error);
      throw error;
    }
  }
}

// Factory pattern
function createMinioClient() {
  return new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
  });
}

// ❌ Missing error handling - should trigger violation
async function uploadWithFactory(filename: string, data: Buffer) {
  const client = createMinioClient();
  await client.putObject('test-bucket', filename, data);
}

// Different variable names
const minioStorage = new Minio.Client({
  endPoint: 'storage.example.com',
  useSSL: true,
  accessKey: 'key',
  secretKey: 'secret'
});

// ❌ Missing error handling - should trigger violation
async function uploadToStorage(filename: string, content: string) {
  await minioStorage.putObject('bucket', filename, content);
}

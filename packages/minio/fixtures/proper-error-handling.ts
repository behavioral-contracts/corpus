import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});

// Proper error handling
async function uploadObject() {
  try {
    await minioClient.putObject('mybucket', 'myobject', 'Hello World');
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Proper error handling
async function downloadObject() {
  try {
    await minioClient.getObject('mybucket', 'myobject');
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}

// Proper error handling
async function listBuckets() {
  try {
    await minioClient.listBuckets();
  } catch (error) {
    console.error('List buckets failed:', error);
    throw error;
  }
}

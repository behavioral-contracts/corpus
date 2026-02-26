import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});

// Missing error handling - should trigger violation
async function uploadObject() {
  await minioClient.putObject('mybucket', 'myobject', 'Hello World');
}

// Missing error handling - should trigger violation
async function downloadObject() {
  await minioClient.getObject('mybucket', 'myobject');
}

// Missing error handling - should trigger violation
async function listBuckets() {
  await minioClient.listBuckets();
}

import { Storage } from '@google-cloud/storage';

const storage = new Storage();

// Missing error handling - should trigger violation
async function uploadFile() {
  const bucket = storage.bucket('my-bucket');
  await bucket.upload('local-file.txt');
}

// Missing error handling - should trigger violation
async function downloadFile() {
  const file = storage.bucket('my-bucket').file('remote-file.txt');
  await file.download();
}

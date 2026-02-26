import { Storage } from '@google-cloud/storage';

const storage = new Storage();

// Proper error handling
async function uploadFile() {
  try {
    const bucket = storage.bucket('my-bucket');
    await bucket.upload('local-file.txt');
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Proper error handling
async function downloadFile() {
  try {
    const file = storage.bucket('my-bucket').file('remote-file.txt');
    await file.download();
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}

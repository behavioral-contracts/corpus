import Queue from 'bull';

const myQueue = new Queue('myQueue', 'redis://localhost:6379');

// Proper error handling in job processor
myQueue.process(async (job) => {
  try {
    const result = await someAsyncOperation(job.data);
    return result;
  } catch (error) {
    console.error('Job processing failed:', error);
    throw error; // Re-throw to mark job as failed
  }
});

// Proper event listeners
myQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

myQueue.on('stalled', (job) => {
  console.error(`Job ${job.id} stalled`);
});

myQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

async function someAsyncOperation(data: any): Promise<any> {
  throw new Error('Operation failed');
}

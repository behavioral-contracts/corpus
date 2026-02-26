import Queue from 'bull';

const myQueue = new Queue('myQueue', 'redis://localhost:6379');

// Missing error handling in job processor
myQueue.process(async (job) => {
  // No try-catch - errors will cause job to fail
  const result = await someAsyncOperation(job.data);
  return result;
});

// Missing failed event listener
// Missing stalled event listener

async function someAsyncOperation(data: any): Promise<any> {
  throw new Error('Operation failed');
}

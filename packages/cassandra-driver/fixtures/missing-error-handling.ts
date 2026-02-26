/**
 * cassandra-driver Fixtures - Missing Error Handling
 *
 * These examples demonstrate INCORRECT error handling (missing try-catch).
 * Should trigger ERROR violations.
 */

import { Client } from 'cassandra-driver';

/**
 * ❌ Missing try-catch for connect
 * Should trigger ERROR violation
 */
async function connectWithoutErrorHandling() {
  const client = new Client({
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1'
  });

  await client.connect();
  return client;
}

/**
 * ❌ Missing try-catch for execute
 * Should trigger ERROR violation
 */
async function executeWithoutErrorHandling(client: Client) {
  const result = await client.execute('SELECT * FROM users');
  return result.rows;
}

/**
 * ❌ Missing try-catch for parameterized query
 * Should trigger ERROR violation
 */
async function parameterizedQueryWithoutErrorHandling(client: Client, userId: string) {
  const query = 'SELECT * FROM users WHERE id = ?';
  const result = await client.execute(query, [userId], { prepare: true });
  return result.rows[0];
}

/**
 * ❌ Missing try-catch for INSERT
 * Should trigger ERROR violation
 */
async function insertWithoutErrorHandling(client: Client, id: string, name: string) {
  const query = 'INSERT INTO users (id, name) VALUES (?, ?)';
  await client.execute(query, [id, name], { prepare: true });
}

/**
 * ❌ Missing try-catch for UPDATE
 * Should trigger ERROR violation
 */
async function updateWithoutErrorHandling(client: Client, userId: string, name: string) {
  const query = 'UPDATE users SET name = ? WHERE id = ?';
  await client.execute(query, [name, userId], { prepare: true });
}

/**
 * ❌ Missing try-catch for DELETE
 * Should trigger ERROR violation
 */
async function deleteWithoutErrorHandling(client: Client, userId: string) {
  const query = 'DELETE FROM users WHERE id = ?';
  await client.execute(query, [userId], { prepare: true });
}

/**
 * ❌ Missing try-catch for batch operations
 * Should trigger ERROR violation
 */
async function batchWithoutErrorHandling(client: Client) {
  const queries = [
    { query: 'INSERT INTO users (id, name) VALUES (?, ?)', params: ['1', 'Alice'] },
    { query: 'INSERT INTO users (id, name) VALUES (?, ?)', params: ['2', 'Bob'] }
  ];

  await client.batch(queries, { prepare: true });
}

/**
 * ❌ Missing try-catch for multiple queries
 * Should trigger ERROR violations
 */
async function multipleQueriesWithoutErrorHandling(client: Client) {
  await client.execute('SELECT * FROM users');
  await client.execute('SELECT * FROM products');
  await client.execute('SELECT * FROM orders');
}

/**
 * ❌ Missing try-catch for shutdown
 * Should trigger ERROR violation (though usually less critical)
 */
async function shutdownWithoutErrorHandling(client: Client) {
  await client.shutdown();
}

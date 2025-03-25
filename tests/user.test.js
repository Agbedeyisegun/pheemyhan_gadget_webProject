const request = require('supertest');
const app = require('@/app'); // Using alias
const pool = require('@/config/database');

describe('User API', () => {
  beforeAll(async () => {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS test_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL
      )
    `);
  });

  afterAll(async () => {
    await pool.execute('DROP TABLE IF EXISTS test_users');
    await pool.end();
  });

  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com' });
    
    expect(res.statusCode).toBe(201);
  });
});
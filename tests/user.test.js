// const request = require('supertest');
// const app = require('../../src/app'); // Adjust path as needed
// const pool = require('../config/database'); // Your DB connection
const request = require('supertest');
const app = require('../src/app');
const pool = require('../config/database');




describe('User API', () => {
  beforeAll(async () => {
    // Set up test database
    await pool.execute('CREATE TABLE IF NOT EXISTS test_users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255))');
  });

  afterAll(async () => {
    // Clean up
    await pool.execute('DROP TABLE IF EXISTS test_users');
    await pool.end();
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com' });
    expect(res.statusCode).toEqual(201);
  });
});
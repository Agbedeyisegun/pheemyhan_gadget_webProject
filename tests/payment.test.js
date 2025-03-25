const request = require('supertest');
const app = require('../app'); // Make sure your app.js exports the Express app

describe('Payment API', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/nonexistent-route');
    expect(res.statusCode).toEqual(404);
  });

  // Add more tests for your payment routes
});
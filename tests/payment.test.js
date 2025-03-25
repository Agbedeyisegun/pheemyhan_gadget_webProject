const request = require('supertest');
const app = require('../app');
const mockPaystack = require('./mocks/paystack'); // Create this mock

jest.mock('../services/paystack', () => mockPaystack);

describe('Payment API', () => {
  it('should initialize payment', async () => {
    const res = await request(app)
      .post('/api/payments/initialize')
      .send({
        email: 'test@example.com',
        amount: 5000
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data.authorization_url');
  });
});
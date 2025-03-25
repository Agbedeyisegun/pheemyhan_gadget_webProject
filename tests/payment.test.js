const request = require('supertest');
const app = require('../../src/app'); 
const mockPaystack = require('./mocks/paystack');

// Mock the entire paystack module
jest.mock('../../src/services/paystack', () => mockPaystack);

describe('Payment API', () => {
  it('should initialize payment', async () => {
    const res = await request(app)
      .post('/api/payments/initialize')
      .send({
        email: 'test@example.com',
        amount: 5000
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('authorization_url');
  });
});
const request = require('supertest');
const app = require('../src/app');

describe('GET /api/users', () => {
    it('should return a list of users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
    });
});
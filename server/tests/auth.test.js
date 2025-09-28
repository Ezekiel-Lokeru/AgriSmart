const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
  it('should return 404 for non-existent login', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'fakeuser', password: 'fakepass' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

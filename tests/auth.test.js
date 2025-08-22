const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

describe('Auth endpoints', () => {
  describe('POST /api/auth/login', () => {
    let user;
    const password = 'password123';

    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        organisation_id: 'org123',
        role: 'user',
      });
    });

    it('should login a user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          });
        expect(res.statusCode).toEqual(401);
      });

    it('should not login with non-existent email', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'wrong@example.com',
            password: 'password123',
          });
        expect(res.statusCode).toEqual(404);
    });
  });
});

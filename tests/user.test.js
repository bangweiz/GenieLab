const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Organisation = require('../src/models/organisation.model');
const bcrypt = require('bcryptjs');
const { ROLE } = require('../src/constants/auth');

describe('User endpoints', () => {
  let rootToken;
  let rootUser;
  let organisation;

  beforeAll(async () => {
    // Create an organisation
    organisation = await Organisation.create({ name: 'Test Organisation' });

    // Create a root user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    rootUser = await User.create({
      username: 'rootuser',
      email: 'root@example.com',
      password: hashedPassword,
      organisation_id: organisation._id.toString(),
      role: ROLE.ROOT,
    });

    // Login as root user to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'root@example.com',
        password: 'password123',
      });
    rootToken = res.body.token;
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        organisation_id: organisation._id.toString(),
        role: ROLE.USER,
      };

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${rootToken}`)
        .send(newUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.username).toBe(newUser.username);
      expect(res.body.email).toBe(newUser.email);

      // Verify user is in the database
      const dbUser = await User.findById(res.body.id);
      expect(dbUser).not.toBeNull();
    });

    it('should not create a user with an existing email', async () => {
        const newUser = {
            username: 'anotheruser',
            email: 'root@example.com', // existing email
            password: 'password123',
            organisation_id: organisation._id.toString(),
            role: ROLE.USER,
        };

        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${rootToken}`)
            .send(newUser);

        expect(res.statusCode).toEqual(400);
    });

    it('should not allow a non-root user to create a user', async () => {
        // First, create a non-root user and get their token
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        const nonRootUser = await User.create({
          username: 'nonroot',
          email: 'nonroot@example.com',
          password: hashedPassword,
          organisation_id: organisation._id.toString(),
          role: ROLE.USER,
        });
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nonroot@example.com', password: 'password123' });
        const nonRootToken = loginRes.body.token;

        const newUser = {
            username: 'newuser2',
            email: 'newuser2@example.com',
            password: 'password123',
            organisation_id: organisation._id.toString(),
            role: ROLE.USER,
        };

        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${nonRootToken}`)
            .send(newUser);

        expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/users', () => {
    it('should return a list of users for a root user', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${rootToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        // There should be at least the root user in the list
        expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should return a single user for a root user', async () => {
        const res = await request(app)
            .get(`/api/users/${rootUser._id}`)
            .set('Authorization', `Bearer ${rootToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBe(rootUser._id.toString());
    });

    it('should return 404 for a non-existent user', async () => {
        const nonExistentId = '60f8f8f8f8f8f8f8f8f8f8f8'; // a valid but non-existent ObjectId
        const res = await request(app)
            .get(`/api/users/${nonExistentId}`)
            .set('Authorization', `Bearer ${rootToken}`);

        expect(res.statusCode).toEqual(404);
    });
  });
});

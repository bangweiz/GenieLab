const request = require('supertest');
const app = require('../src/app');
const Organisation = require('../src/models/organisation.model');
const User = require('../src/models/user.model');

describe('Organisation endpoints', () => {
  describe('POST /api/organisations', () => {
    it('should create a new organisation and a root user', async () => {
      const newOrg = {
        organisationName: 'My New Org',
        username: 'orgadmin',
        email: 'orgadmin@neworg.com',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/organisations')
        .send(newOrg);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('organisation');
      expect(res.body).toHaveProperty('user');
      expect(res.body.organisation.name).toBe(newOrg.organisationName);
      expect(res.body.user.email).toBe(newOrg.email);

      // Verify organisation and user are in the database
      const org = await Organisation.findById(res.body.organisation._id);
      expect(org).not.toBeNull();
      const user = await User.findById(res.body.user.id);
      expect(user).not.toBeNull();
      expect(user.role).toBe('root');
    });

    it('should not create an organisation with a duplicate name', async () => {
      // Create an organisation first
      await Organisation.create({ name: 'Existing Org' });

      const newOrg = {
        organisationName: 'Existing Org',
        username: 'anotheradmin',
        email: 'anotheradmin@neworg.com',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/organisations')
        .send(newOrg);

      expect(res.statusCode).toEqual(400);
    });
  });
});

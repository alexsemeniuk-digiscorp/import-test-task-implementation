import request from 'supertest';

const mockUserData = {
  username: 'tester1',
  email: 'tester1@strapi.com',
  provider: 'local',
  password: '1234abc76ghb#cf',
  confirmed: false,
  blocked: null,
};

it('should create user with email and return token', async () => {
  await strapi.plugins['users-permissions'].services.user.add({
    ...mockUserData,
  });

  await request(strapi.server.httpServer)
    .post('/api/auth/local')
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({
      identifier: mockUserData.email,
      password: mockUserData.password,
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then((data) => {
      expect(data.body.jwt).toBeDefined();
    });
});

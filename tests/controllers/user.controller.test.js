const request = require('supertest-as-promised');
const server = require('../../index');

describe('User signup endpoint', () => {
  it('should create a new user', async () => {
    const res = await request(server)
      .post('/api/signup')
      .send({
        email: 'islam@test.ru',
        password: 'islam'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
  });

  it('should not create a new user with invalid creds', async () => {
    const res = await request(server)
      .post('/api/signup')
      .send({
        email: 'islatest.ru',
        password: 'islam'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });
});

describe('User login endpoint', () => {
  it('should return token with valid creds', async () => {
    const createUser = await request(server)
      .post('/api/signup')
      .send({
        email: 'islam@test.ru',
        password: 'islam'
      });
    const res = await request(server)
      .post('/api/login')
      .send({
        email: 'islam@test.ru',
        password: 'islam'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return error with invalid creds', async () => {
    const res = await request(server)
      .post('/api/login')
      .send({
        email: 'islam@test.ru',
        password: 'iam'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });
});

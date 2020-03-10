const request = require('supertest-as-promised');
const server = require('../../index');

beforeAll(async () => {
  global.createUser = await request(server)
    .post('/api/signup')
    .send({
      email: 'islam@test.ru',
      password: 'islam'
    });

  global.loginUser = await request(server)
    .post('/api/login')
    .send({
      email: 'islam@test.ru',
      password: 'islam'
    });
});

describe('Todo endpoints', () => {
  describe('Todo GET', () => {
    it('should return todos', async () => {
      const res = await request(server)
        .get('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('Todo POST', () => {
    it('should create new todo', async () => {
      const createdTodo = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first todo',
          completed: false,
          editing: false
        });

      expect(createdTodo.statusCode).toEqual(200);
      expect(createdTodo.body).toHaveProperty('data');
    });

    it('should not create new todo without token', async () => {
      const res = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ')
        .send({
          value: 'My first todo',
          completed: false,
          editing: false
        });

      expect(res.statusCode).toEqual(401);
      expect(res.text).toEqual('Unauthorized');
    });

    it('should not create new invalid', async () => {
      const res = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: '',
          completed: false,
          editing: false
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Todo PUT', () => {
    it('should update todo', async () => {
      const todoToUpdate = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first todo',
          completed: false,
          editing: false
        });
      const res = await request(server)
        .put('/api/user/todos/' + todoToUpdate.body.data._id)
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first todo (updated)',
          completed: true,
          editing: false
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.value).toEqual('My first todo (updated)');
      expect(res.body.data.completed).toBe(true);
    });

    it('should not update todo with invalid data', async () => {
      const todoToUpdate = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first todo',
          completed: false,
          editing: false
        });
      const res = await request(server)
        .put('/api/user/todos/' + todoToUpdate.body.data._id)
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: '',
          completed: true,
          editing: false
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Todo DELETE', () => {
    it('should delete todo', async () => {
      const createUser = await request(server)
        .post('/api/signup')
        .send({
          email: 'islamm@teest.ru',
          password: 'islam'
        });

      const loginUser = await request(server)
        .post('/api/login')
        .send({
          email: 'islamm@teest.ru',
          password: 'islam'
        });

      const todoToDelete = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first todo',
          completed: false,
          editing: false
        });

      const getTodos = await request(server)
        .get('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token);

      const res = await request(server)
        .delete('/api/user/todos/' + todoToDelete.body.data._id)
        .set('Authorization', 'Bearer ' + loginUser.body.token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('todo');
    });
  });
});

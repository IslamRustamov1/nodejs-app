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

describe('Comment endpoints', () => {
  describe('Comment GET', () => {
    it('should return comments', async () => {
      const createdTodo = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first comment',
          completed: false,
          editing: false
        });

      const createdComment = await request(server)
        .post('/api/user/todos/' + createdTodo.body.data._id + '/comments')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          text: 'My first comment'
        });

      const res = await request(server)
        .get('/api/user/todos/' + createdTodo.body.data._id + '/comments')
        .set('Authorization', 'Bearer ' + loginUser.body.token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('todo');
    });
  });

  describe('Comment POST', () => {
    it('should create new comment', async () => {
      const createdTodo = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first comment',
          completed: false,
          editing: false
        });

      const createdComment = await request(server)
        .post('/api/user/todos/' + createdTodo.body.data._id + '/comments')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          text: 'My first comment'
        });

      expect(createdComment.statusCode).toEqual(200);
      expect(createdComment.body).toHaveProperty('data');
    });

    it('should not create new comment without token', async () => {
      const createdTodo = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first comment',
          completed: false,
          editing: false
        });

      const createdComment = await request(server)
        .post('/api/user/todos/' + createdTodo.body.data._id + '/comments')
        .set('Authorization', 'Bearer ')
        .send({
          text: 'My first comment'
        });

      expect(createdComment.statusCode).toEqual(401);
      expect(createdComment.text).toEqual('Unauthorized');
    });
  });

  it('should not create new invalid comment', async () => {
    const createdTodo = await request(server)
      .post('/api/user/todos')
      .set('Authorization', 'Bearer ' + loginUser.body.token)
      .send({
        value: 'My first comment',
        completed: false,
        editing: false
      });

    const createdComment = await request(server)
      .post('/api/user/todos/' + createdTodo.body.data._id + '/comments')
      .set('Authorization', 'Bearer ' + loginUser.body.token)
      .send({
        text: ''
      });

    expect(createdComment.statusCode).toEqual(400);
    expect(createdComment.body).toHaveProperty('error');
  });

  describe('Comment PUT', () => {
    it('should update comment', async () => {
      const createdTodo = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first comment',
          completed: false,
          editing: false
        });

      const createdComment = await request(server)
        .post('/api/user/todos/' + createdTodo.body.data._id + '/comments')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          text: 'My first comment'
        });

      const commentToUpdate = await request(server)
        .put(
          '/api/user/todos/' +
            createdTodo.body.data._id +
            '/comments/' +
            createdComment.body.data._id
        )
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          text: 'My first comment (updated)'
        });

      expect(commentToUpdate.statusCode).toEqual(200);
      expect(commentToUpdate.body.data.text).toEqual(
        'My first comment (updated)'
      );
    });

    it('should not update comment with invalid data', async () => {
      const createdTodo = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first comment',
          completed: false,
          editing: false
        });

      const createdComment = await request(server)
        .post('/api/user/todos/' + createdTodo.body.data._id + '/comments')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          text: 'My first comment'
        });

      const commentToUpdate = await request(server)
        .put(
          '/api/user/todos/' +
            createdTodo.body.data._id +
            '/comments/' +
            createdComment.body.data._id
        )
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          text: ''
        });

      expect(commentToUpdate.statusCode).toEqual(400);
      expect(commentToUpdate.body).toHaveProperty('error');
    });
  });

  describe('Comment DELETE', () => {
    it('should delete comment', async () => {
      const createdTodo = await request(server)
        .post('/api/user/todos')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          value: 'My first comment',
          completed: false,
          editing: false
        });

      const createdComment = await request(server)
        .post('/api/user/todos/' + createdTodo.body.data._id + '/comments')
        .set('Authorization', 'Bearer ' + loginUser.body.token)
        .send({
          text: 'My first comment'
        });

      const commentToDelete = await request(server)
        .delete(
          '/api/user/todos/' +
            createdTodo.body.data._id +
            '/comments/' +
            createdComment.body.data._id
        )
        .set('Authorization', 'Bearer ' + loginUser.body.token);

      expect(commentToDelete.statusCode).toEqual(200);
      expect(commentToDelete.body).toHaveProperty('comment');
    });
  });
});

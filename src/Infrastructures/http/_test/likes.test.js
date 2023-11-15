/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const ThreadCommentLikesTableTestHelper = require('../../../../tests/ThreadCommentLikesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentLikesTableTestHelper.cleanTable();
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 when missing authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/threads-123/comments/comment-123/likes',
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(result.error).toEqual('Unauthorized');
    });

    it('should response 404 when thread is not found', async () => {
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
      });

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/threads-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(result.status).toEqual('fail');
    });

    it('should response 404 when comment is not found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
        username: 'dicoding',
      });

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/threads-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual('there are no comments on this thread');
    });

    it('should response 200 when like or dislike success', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
        username: 'dicoding',
      });

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/threads-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(result.status).toEqual('success');
    });
  });
});

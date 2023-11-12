/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('should response 401 when missing authentication', async () => {
      const payload = {
        content: 'comment replies',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threads-123/comments/comment-123/replies',
        payload,
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(result.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threads-123/comments/comment-123/replies',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual(
        'cannot create a new comment replies because the required property does not exist',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const payload = {
        content: 123,
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threads-123/comments/comment-123/replies',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual(
        'unable to create a new comment replies because the data type does not match',
      );
    });

    it('should response 404 when thread is not found', async () => {
      const payload = {
        content: 'comment replies',
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threads-123/comments/comment-123/replies',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual('thread not found');
    });

    it('should response 404 when comment is not found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const payload = {
        content: 'comment replies',
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
        username: 'dicoding',
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threads-123/comments/comment-123/replies',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual('there are no comments on this thread');
    });

    it('should response 201 and persisted replies', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const payload = {
        content: 'comment replies',
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
        username: 'dicoding',
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threads-123/comments/comment-123/replies',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(result.status).toEqual('success');
      expect(result.data.addedReply).toBeDefined();
      expect(result.data.addedReply.id).toBeDefined();
      expect(result.data.addedReply.content).toBeDefined();
      expect(result.data.addedReply.owner).toBeDefined();
    });
  });

  describe('when DELETE /comments', () => {
    it('should response 401 when missing authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/threads-123/comments/comment-123/replies/replies-123',
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(result.error).toEqual('Unauthorized');
    });

    it('should response 404 when one of thread, comment and replies is not found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
        username: 'dicoding',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/threads-123/comments/comment-123/replies/replies-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual('there are no replies on this comment');
    });

    it('should response 403 when user is not owner', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});
      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({});

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/threads-123/comments/comment-123/replies/replies-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual(
        'you are not authorized to access this resource',
      );
    });

    it('should response 200 and deleted comment replies', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const server = await createServer(container);

      const { userId, accessToken } = await ServerTestHelper.getCredentialsUser(
        {
          server,
          username: 'dicoding',
        },
      );

      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({
        owner: userId,
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/threads-123/comments/comment-123/replies/replies-123',
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

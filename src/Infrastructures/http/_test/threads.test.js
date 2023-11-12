/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');

describe('threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 401 when missing authentication', async () => {
      const payload = {
        title: 'thread title',
        body: 'thread body',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(result.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const payload = {
        title: 'thread title',
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual(
        'cannot create a new thread because the required property does not exist',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const payload = {
        title: 'thread title',
        body: true,
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual(
        'unable to create a new thread because the data type does not match',
      );
    });

    it('should response 201 and persisted threads', async () => {
      const payload = {
        title: 'thread title',
        body: 'thread body',
      };

      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getCredentialsUser({
        server,
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(result.status).toEqual('success');
      expect(result.data.addedThread).toBeDefined();
      expect(result.data.addedThread.id).toBeDefined();
      expect(result.data.addedThread.title).toBeDefined();
      expect(result.data.addedThread.owner).toBeDefined();
    });
  });

  describe('when GET /threads/{id}', () => {
    it('should response 404 when thread is not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/threads-123',
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(result.status).toEqual('fail');
      expect(result.message).toEqual('thread not found');
    });

    it('should response 200 when get threads detail', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/threads-123',
      });

      const result = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(result.status).toEqual('success');
      expect(result.data.thread).toBeDefined();
      expect(result.data.thread.id).toBeDefined();
      expect(result.data.thread.title).toBeDefined();
      expect(result.data.thread.body).toBeDefined();
      expect(result.data.thread.date).toBeDefined();
      expect(result.data.thread.username).toBeDefined();
      expect(result.data.thread.comments).toBeDefined();
    });
  });
});

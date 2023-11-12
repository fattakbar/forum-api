/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      const requestPayload = {
        username: 'akbar',
        password: 'secret_password',
        fullname: 'Fattahul Akbar',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        fullname: 'Fattahul Akbar',
        password: 'secret_password',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'cannot create a new user because the required property does not exist',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        username: 'akbar',
        password: 'secret_password',
        fullname: 123,
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'unable to create a new user because the data type does not match',
      );
    });

    it('should response 400 when username more than 50 character', async () => {
      const requestPayload = {
        username:
          'fattahulakbarfattahulakbarfattahulakbarfattahulakbarfattahulakbarfattahulakbarfattahulakbarfattahulakbar',
        password: 'secret_password',
        fullname: 'Fattahul Akbar',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'cannot create a new user because the username character exceeds the limit',
      );
    });

    it('should response 400 when username contain restricted character', async () => {
      const requestPayload = {
        username: 'fattahul akbar',
        password: 'secret_password',
        fullname: 'Fattahul Akbar',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      );
    });

    it('should response 400 when username unavailable', async () => {
      await UsersTableTestHelper.addUser({ username: 'akbar' });

      const requestPayload = {
        username: 'akbar',
        fullname: 'Fattahul Akbar',
        password: 'secret_password',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia');
    });
  });
});

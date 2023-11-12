/* eslint-disable no-undef */
const createServer = require('../createServer');

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    const server = await createServer({});

    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    expect(response.statusCode).toEqual(404);
  });

  describe('when GET /', () => {
    it('should return 200 and welcome page api', async () => {
      const server = await createServer({});

      const response = await server.inject({
        method: 'GET',
        url: '/',
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.value).toEqual('Welcome to forum-api v2!');
    });
  });

  it('should handle server error correctly', async () => {
    const requestPayload = {
      username: 'akbar',
      fullname: 'Fattahul Akbar',
      password: 'secret_password',
    };

    const server = await createServer({});

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('there was a failure on our server.');
  });
});

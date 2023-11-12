const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const config = require('../../../config/env');
const ClientError = require('../../Common/exceptions/ClientError');
const DomainErrorTranslator = require('../../Common/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/threads/comments');
const replies = require('../../Interfaces/http/api/threads/comments/replies');
const authentications = require('../../Interfaces/http/api/authentications');
const { failResponse, errorResponse } = require('../../../config/helper');

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: config.jwt.token.access,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.age,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
  ]);

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      value: 'Welcome to forum-api v2!',
    }),
  });

  server.ext('onPreResponse', async (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        return failResponse(
          h,
          translatedError.message,
          translatedError.statusCode,
        );
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      return errorResponse(h, response);
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;

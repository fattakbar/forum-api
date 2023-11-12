const AuthenticationsHandler = require('./handler');
const authenticationRoutes = require('./routes');

module.exports = {
  name: 'authentications',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container);
    server.route(authenticationRoutes(authenticationsHandler));
  },
};

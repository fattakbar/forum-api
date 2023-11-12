const UsersHandler = require('./handler');
const userRoutes = require('./routes');

module.exports = {
  name: 'users',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container);
    server.route(userRoutes(usersHandler));
  },
};

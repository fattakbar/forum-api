const ThreadsHandler = require('./handler');
const threadRoutes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadsHandle = new ThreadsHandler(container);
    server.route(threadRoutes(threadsHandle));
  },
};

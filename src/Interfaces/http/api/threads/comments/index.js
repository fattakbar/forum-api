const ThreadCommentsHandler = require('./handler');
const threadComment = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    const threadCommentsHandler = new ThreadCommentsHandler(container);
    server.route(threadComment(threadCommentsHandler));
  },
};

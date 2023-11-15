const CommentLikesHandler = require('./handler');
const commentLike = require('./routes');

module.exports = {
  name: 'likes',
  register: async (server, { container }) => {
    const commentLikesHandler = new CommentLikesHandler(container);
    server.route(commentLike(commentLikesHandler));
  },
};

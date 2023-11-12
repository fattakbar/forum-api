const RepliesCommentHandler = require('./handler');
const repliesComment = require('./routes');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const repliesCommentHandler = new RepliesCommentHandler(container);
    server.route(repliesComment(repliesCommentHandler));
  },
};

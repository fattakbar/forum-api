const repliesComment = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postRepliesToCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{repliesId}',
    handler: handler.deleteRepliesFromCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

module.exports = repliesComment;

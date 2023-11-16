const commentLike = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putCommentLike,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

module.exports = commentLike;

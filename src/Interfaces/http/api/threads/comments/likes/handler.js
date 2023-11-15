const autoBind = require('auto-bind');
const LikeOrDislikeCommentUseCase = require('../../../../../../Applications/use_case/threads/comments/LikeOrDislikeCommentUseCase');
const { successResponse } = require('../../../../../../../config/helper');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async putCommentLike(request, h) {
    const { threadId, commentId } = request.params;

    const likedPayload = {
      threadId,
      commentId,
      userId: request.auth.credentials.id,
    };

    const likeOrDislikeCommentUseCase = this._container.getInstance(
      LikeOrDislikeCommentUseCase.name,
    );

    await likeOrDislikeCommentUseCase.execute(likedPayload);

    return successResponse(h, {});
  }
}

module.exports = CommentLikesHandler;

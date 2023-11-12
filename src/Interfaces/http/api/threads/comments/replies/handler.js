const autoBind = require('auto-bind');
const AddRepliesToCommentUseCase = require('../../../../../../Applications/use_case/threads/comments/replies/AddRepliesToCommentUseCase');
const DeleteRepliesFromCommentUseCase = require('../../../../../../Applications/use_case/threads/comments/replies/DeleteRepliesFromCommentUseCase');
const { successResponse } = require('../../../../../../../config/helper');

class RepliesCommentHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postRepliesToCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { content } = request.payload;

    const repliesPayload = {
      content,
      threadId,
      commentId,
      owner: request.auth.credentials.id,
    };

    const addRepliesToCommentUseCase = this._container.getInstance(
      AddRepliesToCommentUseCase.name,
    );

    const addedReply = await addRepliesToCommentUseCase.execute(repliesPayload);

    return successResponse(h, {
      responseData: { addedReply },
      responseCode: 201,
    });
  }

  async deleteRepliesFromCommentHandler(request, h) {
    const { repliesId, commentId, threadId } = request.params;

    const payload = {
      repliesId,
      commentId,
      threadId,
      userId: request.auth.credentials.id,
    };

    const deleteRepliesFromCommentUseCase = this._container.getInstance(
      DeleteRepliesFromCommentUseCase.name,
    );

    await deleteRepliesFromCommentUseCase.execute(payload);

    return successResponse(h, {
      responseMessage: 'replies on comment have been deleted',
    });
  }
}

module.exports = RepliesCommentHandler;

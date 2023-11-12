const autoBind = require('auto-bind');
const AddCommentToThreadUseCase = require('../../../../../Applications/use_case/threads/comments/AddCommentToThreadUseCase');
const DeleteCommentFromThreadUseCase = require('../../../../../Applications/use_case/threads/comments/DeleteCommentFromThreadUseCase');
const { successResponse } = require('../../../../../../config/helper');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentToThread(request, h) {
    const { threadId } = request.params;
    const { content } = request.payload;

    const commentPayload = {
      content,
      threadId,
      owner: request.auth.credentials.id,
    };

    const addCommentToThreadUseCase = this._container.getInstance(
      AddCommentToThreadUseCase.name,
    );

    const addedComment = await addCommentToThreadUseCase.execute(
      commentPayload,
    );

    return successResponse(h, {
      responseData: { addedComment },
      responseCode: 201,
    });
  }

  async deleteCommentFromThread(request, h) {
    const { commentId, threadId } = request.params;

    const payload = {
      commentId,
      threadId,
      userId: request.auth.credentials.id,
    };

    const deleteCommentFromThreadUseCase = this._container.getInstance(
      DeleteCommentFromThreadUseCase.name,
    );

    await deleteCommentFromThreadUseCase.execute(payload);

    return successResponse(h, {
      responseMessage: 'comments on thread have been deleted',
    });
  }
}

module.exports = ThreadCommentsHandler;

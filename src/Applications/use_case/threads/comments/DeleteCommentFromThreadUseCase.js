const DeleteComment = require('../../../../Domains/threads/comments/entities/DeleteComment');

class DeleteCommentFromThreadUseCase {
  constructor({ threadCommentsRepository }) {
    this._threadCommentsRepository = threadCommentsRepository;
  }

  async execute(payload) {
    const { commentId, threadId, userId } = new DeleteComment(payload);

    await this._threadCommentsRepository.verifyAvailableCommentInThread(
      commentId,
      threadId,
    );

    await this._threadCommentsRepository.verifyCommentOwner(commentId, userId);
    await this._threadCommentsRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentFromThreadUseCase;

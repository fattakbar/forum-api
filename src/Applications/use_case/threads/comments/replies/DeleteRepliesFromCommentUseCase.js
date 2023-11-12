const DeleteCommentReplies = require('../../../../../Domains/threads/comments/replies/entities/DeleteCommentReplies');

class DeleteRepliesFromCommentUseCase {
  constructor({ threadCommentRepliesRepository }) {
    this._threadCommentRepliesRepository = threadCommentRepliesRepository;
  }

  async execute(payload) {
    const useCasePayload = new DeleteCommentReplies(payload);

    await this._threadCommentRepliesRepository.verifyAvailableRepliesInThread(
      useCasePayload.repliesId,
      useCasePayload.commentId,
      useCasePayload.threadId,
    );

    await this._threadCommentRepliesRepository.verifyRepliesOwner(
      useCasePayload.repliesId,
      useCasePayload.userId,
    );

    await this._threadCommentRepliesRepository.deleteRepliesById(
      useCasePayload.repliesId,
    );
  }
}

module.exports = DeleteRepliesFromCommentUseCase;

const NewCommentReplies = require('../../../../../Domains/threads/comments/replies/entities/NewCommentReplies');

class AddRepliesToCommentUseCase {
  constructor({
    threadCommentRepliesRepository,
    threadCommentsRepository,
    threadsRepository,
  }) {
    this._threadCommentRepliesRepository = threadCommentRepliesRepository;
    this._threadCommentsRepository = threadCommentsRepository;
    this._threadsRepository = threadsRepository;
  }

  async execute(payload) {
    const newCommentReplies = new NewCommentReplies(payload);

    await this._threadsRepository.verifyAvailableThread(payload.threadId);

    await this._threadCommentsRepository.verifyAvailableCommentInThread(
      payload.commentId,
      payload.threadId,
    );

    return this._threadCommentRepliesRepository.addRepliesToComment(
      newCommentReplies,
    );
  }
}

module.exports = AddRepliesToCommentUseCase;

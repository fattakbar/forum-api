const NewComment = require('../../../../Domains/threads/comments/entities/NewComment');

class AddCommentToThreadUseCase {
  constructor({ threadCommentsRepository, threadsRepository }) {
    this._threadCommentsRepository = threadCommentsRepository;
    this._threadsRepository = threadsRepository;
  }

  async execute(payload) {
    const newComment = new NewComment(payload);

    await this._threadsRepository.verifyAvailableThread(payload.threadId);

    return this._threadCommentsRepository.addCommentToThread(newComment);
  }
}

module.exports = AddCommentToThreadUseCase;

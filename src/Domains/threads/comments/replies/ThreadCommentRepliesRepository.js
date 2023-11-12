/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

class ThreadCommentRepliesRepository {
  async addRepliesToComment(newReplies) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesCommentFromThread(threadId) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteRepliesById(repliesId) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRepliesOwner(repliesId, owner) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableRepliesInThread(repliesId, commentId, threadId) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentRepliesRepository;

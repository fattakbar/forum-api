/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

class ThreadCommentsRepository {
  async addCommentToThread(newComment) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentsFromThread(threadId) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getNumberOfCommentsByThread(threadId) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentById(commentId) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(commentId, owner) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableCommentInThread(commentId, threadId) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentsRepository;

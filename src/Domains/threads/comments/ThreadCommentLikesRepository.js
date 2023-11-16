/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

class ThreadCommentLikesRepository {
  async likeComment(newCommentLikes) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async unlikeComment(userId, commentId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentHasBeenLikedOrNot(userId, commentId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentLikesRepository;

const NewCommentLikes = require('../../../../Domains/threads/comments/entities/NewCommentLikes');

class LikeOrDislikeCommentUseCase {
  constructor({ threadCommentLikesRepository, threadCommentsRepository }) {
    this._threadCommentLikesRepository = threadCommentLikesRepository;
    this._threadCommentsRepository = threadCommentsRepository;
  }

  async execute(payload) {
    const newCommentLikes = new NewCommentLikes(payload);

    await this._threadCommentsRepository.verifyAvailableCommentInThread(
      newCommentLikes.commentId,
      newCommentLikes.threadId,
    );

    const isLiked =
      await this._threadCommentLikesRepository.verifyCommentHasBeenLikedOrNot(
        newCommentLikes.userId,
        newCommentLikes.commentId,
      );

    if (isLiked) {
      return this._threadCommentLikesRepository.unlikeComment(
        newCommentLikes.userId,
        newCommentLikes.commentId,
      );
    }

    return this._threadCommentLikesRepository.likeComment(newCommentLikes);
  }
}

module.exports = LikeOrDislikeCommentUseCase;

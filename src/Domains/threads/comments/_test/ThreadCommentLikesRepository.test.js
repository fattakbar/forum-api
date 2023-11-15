/* eslint-disable no-undef */
const ThreadCommentLikesRepository = require('../ThreadCommentLikesRepository');

describe('ThreadCommentLikesRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const threadCommentLikesRepository = new ThreadCommentLikesRepository();

    await expect(
      threadCommentLikesRepository.likeComment({}),
    ).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      threadCommentLikesRepository.unlikeComment('', ''),
    ).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      threadCommentLikesRepository.verifyCommentHasBeenLikedOrNot('', ''),
    ).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});

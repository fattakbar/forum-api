/* eslint-disable no-undef */
const ThreadCommentRepliesRepository = require('../ThreadCommentRepliesRepository');

describe('ThreadCommentRepliesRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const threadCommentRepliesRepository = new ThreadCommentRepliesRepository();

    await expect(
      threadCommentRepliesRepository.addRepliesToComment({}),
    ).rejects.toThrowError(
      'THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      threadCommentRepliesRepository.getRepliesCommentFromThread(''),
    ).rejects.toThrowError(
      'THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      threadCommentRepliesRepository.deleteRepliesById(''),
    ).rejects.toThrowError(
      'THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      threadCommentRepliesRepository.verifyRepliesOwner('', ''),
    ).rejects.toThrowError(
      'THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      threadCommentRepliesRepository.verifyAvailableRepliesInThread('', '', ''),
    ).rejects.toThrowError(
      'THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});

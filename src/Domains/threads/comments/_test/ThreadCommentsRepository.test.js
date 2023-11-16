/* eslint-disable no-undef */
const ThreadCommentsRepository = require('../ThreadCommentsRepository');

describe('ThreadCommentsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const threadCommentsRepository = new ThreadCommentsRepository();

    await expect(
      threadCommentsRepository.addCommentToThread({}),
    ).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
      threadCommentsRepository.getCommentsFromThread(''),
    ).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
      threadCommentsRepository.getNumberOfCommentsByThread(''),
    ).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
      threadCommentsRepository.deleteCommentById(''),
    ).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
      threadCommentsRepository.verifyCommentOwner('', ''),
    ).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
      threadCommentsRepository.verifyAvailableCommentInThread('', ''),
    ).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

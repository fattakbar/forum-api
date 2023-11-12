/* eslint-disable no-undef */
const ThreadsRepository = require('../ThreadsRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const threadRepository = new ThreadsRepository();

    await expect(threadRepository.addThread({})).rejects.toThrowError(
      'THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadRepository.getThreadById('')).rejects.toThrowError(
      'THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      threadRepository.verifyAvailableThread(''),
    ).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

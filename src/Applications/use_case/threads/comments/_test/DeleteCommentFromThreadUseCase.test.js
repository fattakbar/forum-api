/* eslint-disable no-undef */
const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository');
const DeleteCommentFromThreadUseCase = require('../DeleteCommentFromThreadUseCase');

describe('DeleteCommentFromThreadUseCase', () => {
  it('should orchestracting the delete comment action correctly', async () => {
    const payload = {
      commentId: 'comment-123',
      threadId: 'threads-123',
      userId: 'user-123',
    };

    const mockThreadCommentsRepository = new ThreadCommentsRepository();

    mockThreadCommentsRepository.verifyAvailableCommentInThread = jest.fn(() =>
      Promise.resolve(),
    );

    mockThreadCommentsRepository.verifyCommentOwner = jest.fn(() =>
      Promise.resolve(),
    );

    mockThreadCommentsRepository.deleteCommentById = jest.fn(() =>
      Promise.resolve(),
    );

    const deleteCommentFromThreadUseCase = new DeleteCommentFromThreadUseCase({
      threadCommentsRepository: mockThreadCommentsRepository,
    });

    await expect(
      deleteCommentFromThreadUseCase.execute(payload),
    ).resolves.not.toThrowError();

    expect(
      mockThreadCommentsRepository.verifyAvailableCommentInThread,
    ).toBeCalledWith(payload.commentId, payload.threadId);

    expect(mockThreadCommentsRepository.verifyCommentOwner).toBeCalledWith(
      payload.commentId,
      payload.userId,
    );

    expect(mockThreadCommentsRepository.deleteCommentById).toBeCalledWith(
      payload.commentId,
    );
  });
});

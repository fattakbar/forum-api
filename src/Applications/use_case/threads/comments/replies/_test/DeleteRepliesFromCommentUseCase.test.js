/* eslint-disable no-undef */
const ThreadCommentRepliesRepository = require('../../../../../../Domains/threads/comments/replies/ThreadCommentRepliesRepository');
const DeleteRepliesFromCommentUseCase = require('../DeleteRepliesFromCommentUseCase');

describe('DeleteRepliesFromCommentUseCase', () => {
  it('should orchestracting the delete replies from comment action correctly', async () => {
    const useCasePayload = {
      repliesId: 'replies-123',
      commentId: 'comment-123',
      threadId: 'threads-123',
      userId: 'user-123',
    };

    const mockThreadCommentRepliesRepository =
      new ThreadCommentRepliesRepository();

    mockThreadCommentRepliesRepository.verifyAvailableRepliesInThread = jest.fn(
      () => Promise.resolve(),
    );
    mockThreadCommentRepliesRepository.verifyRepliesOwner = jest.fn(() =>
      Promise.resolve(),
    );
    mockThreadCommentRepliesRepository.deleteRepliesById = jest.fn(() =>
      Promise.resolve(),
    );

    const deleteRepliesFromCommentUseCase = new DeleteRepliesFromCommentUseCase(
      { threadCommentRepliesRepository: mockThreadCommentRepliesRepository },
    );

    await expect(
      deleteRepliesFromCommentUseCase.execute(useCasePayload),
    ).resolves.not.toThrowError();

    expect(
      mockThreadCommentRepliesRepository.verifyAvailableRepliesInThread,
    ).toBeCalledWith(
      useCasePayload.repliesId,
      useCasePayload.commentId,
      useCasePayload.threadId,
    );

    expect(
      mockThreadCommentRepliesRepository.verifyRepliesOwner,
    ).toBeCalledWith(useCasePayload.repliesId, useCasePayload.userId);

    expect(mockThreadCommentRepliesRepository.deleteRepliesById).toBeCalledWith(
      useCasePayload.repliesId,
    );
  });
});

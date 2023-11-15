/* eslint-disable no-undef */
const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository');
const ThreadCommentLikesRepository = require('../../../../../Domains/threads/comments/ThreadCommentLikesRepository');
const LikeOrDislikeCommentUseCase = require('../LikeOrDislikeCommentUseCase');

describe('LikeOrDislikeCommentUseCase', () => {
  it('should orchestracting the like comment action correctly', async () => {
    const payload = {
      threadId: 'threads-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadCommentsRepository = new ThreadCommentsRepository();
    const mockThreadCommentLikesRepository = new ThreadCommentLikesRepository();

    mockThreadCommentsRepository.verifyAvailableCommentInThread = jest.fn(() =>
      Promise.resolve(),
    );

    mockThreadCommentLikesRepository.verifyCommentHasBeenLikedOrNot = jest.fn(
      () => Promise.resolve(),
    );

    mockThreadCommentLikesRepository.likeComment = jest.fn(() =>
      Promise.resolve(),
    );

    const likeOrDislikeCommentUseCase = new LikeOrDislikeCommentUseCase({
      threadCommentLikesRepository: mockThreadCommentLikesRepository,
      threadCommentsRepository: mockThreadCommentsRepository,
    });

    await likeOrDislikeCommentUseCase.execute(payload);

    expect(
      mockThreadCommentsRepository.verifyAvailableCommentInThread,
    ).toBeCalledWith(payload.commentId, payload.threadId);

    expect(
      mockThreadCommentLikesRepository.verifyCommentHasBeenLikedOrNot,
    ).toBeCalledWith(payload.userId, payload.commentId);

    expect(mockThreadCommentLikesRepository.likeComment).toBeCalledWith(
      payload,
    );
  });

  it('should orchestracting the dislike comment action correctly', async () => {
    const payload = {
      threadId: 'threads-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadCommentsRepository = new ThreadCommentsRepository();
    const mockThreadCommentLikesRepository = new ThreadCommentLikesRepository();

    mockThreadCommentsRepository.verifyAvailableCommentInThread = jest.fn(() =>
      Promise.resolve(),
    );

    mockThreadCommentLikesRepository.verifyCommentHasBeenLikedOrNot = jest.fn(
      () => Promise.resolve(true),
    );

    mockThreadCommentLikesRepository.unlikeComment = jest.fn(() =>
      Promise.resolve(),
    );

    const likeOrDislikeCommentUseCase = new LikeOrDislikeCommentUseCase({
      threadCommentLikesRepository: mockThreadCommentLikesRepository,
      threadCommentsRepository: mockThreadCommentsRepository,
    });

    await likeOrDislikeCommentUseCase.execute(payload);

    expect(
      mockThreadCommentsRepository.verifyAvailableCommentInThread,
    ).toBeCalledWith(payload.commentId, payload.threadId);

    expect(
      mockThreadCommentLikesRepository.verifyCommentHasBeenLikedOrNot,
    ).toBeCalledWith(payload.userId, payload.commentId);

    expect(mockThreadCommentLikesRepository.unlikeComment).toBeCalledWith(
      payload.userId,
      payload.commentId,
    );
  });
});

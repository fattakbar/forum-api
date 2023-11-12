/* eslint-disable no-undef */
const AddedCommentReplies = require('../../../../../../Domains/threads/comments/replies/entities/AddedCommentReplies');
const NewCommentReplies = require('../../../../../../Domains/threads/comments/replies/entities/NewCommentReplies');
const ThreadCommentsRepository = require('../../../../../../Domains/threads/comments/ThreadCommentsRepository');
const ThreadsRepository = require('../../../../../../Domains/threads/ThreadsRepository');
const ThreadCommentRepliesRepository = require('../../../../../../Domains/threads/comments/replies/ThreadCommentRepliesRepository');
const AddRepliesToCommentUseCase = require('../AddRepliesToCommentUseCase');

describe('AddRepliesToCommentUseCase', () => {
  it('should orchestracting the add replies to comment action correctly', async () => {
    const payload = {
      content: 'comment replies',
      threadId: 'threads-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectedAddedCommentReplies = new AddedCommentReplies({
      id: 'replies-123',
      content: 'comment replies',
      owner: 'user-123',
    });

    const mockThreadCommentRepliesRepository =
      new ThreadCommentRepliesRepository();

    const mockThreadCommentsRepository = new ThreadCommentsRepository();
    const mockThreadsRepository = new ThreadsRepository();

    mockThreadsRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(),
    );

    mockThreadCommentsRepository.verifyAvailableCommentInThread = jest.fn(() =>
      Promise.resolve(),
    );

    mockThreadCommentRepliesRepository.addRepliesToComment = jest.fn(() =>
      Promise.resolve(
        new AddedCommentReplies({
          id: 'replies-123',
          content: payload.content,
          owner: payload.owner,
        }),
      ),
    );

    const addRepliesToCommentUseCase = new AddRepliesToCommentUseCase({
      threadCommentRepliesRepository: mockThreadCommentRepliesRepository,
      threadCommentsRepository: mockThreadCommentsRepository,
      threadsRepository: mockThreadsRepository,
    });

    const addedCommentReplies = await addRepliesToCommentUseCase.execute(
      payload,
    );

    expect(addedCommentReplies).toStrictEqual(expectedAddedCommentReplies);

    expect(mockThreadsRepository.verifyAvailableThread).toBeCalledWith(
      payload.threadId,
    );

    expect(
      mockThreadCommentsRepository.verifyAvailableCommentInThread,
    ).toBeCalledWith(payload.commentId, payload.threadId);

    expect(
      mockThreadCommentRepliesRepository.addRepliesToComment,
    ).toBeCalledWith(
      new NewCommentReplies({
        content: payload.content,
        threadId: payload.threadId,
        commentId: payload.commentId,
        owner: payload.owner,
      }),
    );
  });
});

/* eslint-disable no-undef */
const AddedComment = require('../../../../../Domains/threads/comments/entities/AddedComment');
const NewComment = require('../../../../../Domains/threads/comments/entities/NewComment');
const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository');
const ThreadsRepository = require('../../../../../Domains/threads/ThreadsRepository');
const AddCommentToThreadUseCase = require('../AddCommentToThreadUseCase');

describe('AddCommentToThreadUseCase', () => {
  it('should orchestracting the add comment to thread action correctly', async () => {
    const payload = {
      content: 'coment',
      threadId: 'threads-123',
      owner: 'user-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'coment',
      owner: 'user-123',
    });

    const mockThreadCommentsRepository = new ThreadCommentsRepository();
    const mockThreadsRepository = new ThreadsRepository();

    mockThreadsRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(),
    );

    mockThreadCommentsRepository.addCommentToThread = jest.fn(() =>
      Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          content: payload.content,
          owner: payload.owner,
        }),
      ),
    );

    const addCommentToThreadUseCase = new AddCommentToThreadUseCase({
      threadCommentsRepository: mockThreadCommentsRepository,
      threadsRepository: mockThreadsRepository,
    });

    const addedComment = await addCommentToThreadUseCase.execute(payload);

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadsRepository.verifyAvailableThread).toBeCalledWith(
      payload.threadId,
    );
    expect(mockThreadCommentsRepository.addCommentToThread).toBeCalledWith(
      new NewComment({
        content: payload.content,
        threadId: payload.threadId,
        owner: payload.owner,
      }),
    );
  });
});

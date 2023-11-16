/* eslint-disable no-undef */
const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository');
const ThreadCommentsRepository = require('../../../../Domains/threads/comments/ThreadCommentsRepository');
const ThreadCommentRepliesRepository = require('../../../../Domains/threads/comments/replies/ThreadCommentRepliesRepository');
const DetailThread = require('../../../../Domains/threads/entities/DetailThread');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestracting the get thread by id action correctly', async () => {
    const payload = {
      id: 'threads-123',
    };

    const currentDate = new Date();

    const expectedThread = {
      id: 'threads-123',
      title: 'thread',
      body: 'content',
      date: currentDate,
      username: 'akbar',
      comments: [
        {
          id: 'comment-123',
          username: 'akbar',
          date: currentDate,
          content: 'comment',
          likeCount: 1,
          replies: [
            {
              id: 'replies-123',
              content: 'comment replies',
              date: currentDate,
              username: 'akbar',
            },
          ],
        },
      ],
    };

    const mockThreadsRepository = new ThreadsRepository();
    const mockThreadCommentsRepository = new ThreadCommentsRepository();
    const mockThreadCommentRepliesRepository =
      new ThreadCommentRepliesRepository();

    mockThreadsRepository.getThreadById = jest.fn(() =>
      Promise.resolve(
        new DetailThread({
          id: 'threads-123',
          title: 'thread',
          body: 'content',
          date: currentDate,
          username: 'akbar',
        }),
      ),
    );

    mockThreadCommentsRepository.getCommentsFromThread = jest.fn(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'akbar',
          date: currentDate,
          content: 'comment',
          is_deleted: false,
        },
      ]),
    );

    mockThreadCommentsRepository.getNumberOfCommentsByThread = jest.fn(() =>
      Promise.resolve([
        {
          likes: 1,
          thread_comment_id: 'comment-123',
        },
      ]),
    );

    mockThreadCommentRepliesRepository.getRepliesCommentFromThread = jest.fn(
      () =>
        Promise.resolve([
          {
            id: 'replies-123',
            comment_id: 'comment-123',
            content: 'comment replies',
            date: currentDate,
            username: 'akbar',
            is_deleted: false,
          },
        ]),
    );

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadsRepository: mockThreadsRepository,
      threadCommentsRepository: mockThreadCommentsRepository,
      threadCommentRepliesRepository: mockThreadCommentRepliesRepository,
    });

    const detailThread = await getThreadDetailUseCase.execute(payload.id);

    expect(detailThread).toStrictEqual(expectedThread);
    expect(mockThreadsRepository.getThreadById).toBeCalledWith(payload.id);

    expect(mockThreadCommentsRepository.getCommentsFromThread).toBeCalledWith(
      payload.id,
    );

    expect(
      mockThreadCommentsRepository.getNumberOfCommentsByThread,
    ).toBeCalledWith(payload.id);

    expect(
      mockThreadCommentRepliesRepository.getRepliesCommentFromThread,
    ).toBeCalledWith(payload.id);
  });

  it('should orchestracting the get thread by id action correctly with deleted content', async () => {
    const payload = {
      id: 'threads-123',
    };

    const currentDate = new Date();

    const expectedThread = {
      id: 'threads-123',
      title: 'thread',
      body: 'content',
      date: currentDate,
      username: 'akbar',
      comments: [
        {
          id: 'comment-123',
          username: 'akbar',
          date: currentDate,
          content: 'comment',
          likeCount: 0,
          replies: [
            {
              id: 'replies-123',
              content: '**balasan telah dihapus**',
              date: currentDate,
              username: 'akbar',
            },
          ],
        },
        {
          id: 'comment-124',
          username: 'akbar',
          date: currentDate,
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [],
        },
      ],
    };

    const mockThreadsRepository = new ThreadsRepository();
    const mockThreadCommentsRepository = new ThreadCommentsRepository();
    const mockThreadCommentRepliesRepository =
      new ThreadCommentRepliesRepository();

    mockThreadsRepository.getThreadById = jest.fn(() =>
      Promise.resolve(
        new DetailThread({
          id: 'threads-123',
          title: 'thread',
          body: 'content',
          date: currentDate,
          username: 'akbar',
        }),
      ),
    );

    mockThreadCommentsRepository.getCommentsFromThread = jest.fn(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'akbar',
          date: currentDate,
          content: 'comment',
          is_deleted: false,
        },
        {
          id: 'comment-124',
          username: 'akbar',
          date: currentDate,
          content: 'comment',
          is_deleted: true,
        },
      ]),
    );

    mockThreadCommentsRepository.getNumberOfCommentsByThread = jest.fn(() =>
      Promise.resolve([
        {
          likes: 0,
          thread_comment_id: 'comment-123',
        },
        {
          likes: 0,
          thread_comment_id: 'comment-124',
        },
      ]),
    );

    mockThreadCommentRepliesRepository.getRepliesCommentFromThread = jest.fn(
      () =>
        Promise.resolve([
          {
            id: 'replies-123',
            comment_id: 'comment-123',
            content: 'comment replies',
            date: currentDate,
            username: 'akbar',
            is_deleted: true,
          },
        ]),
    );

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadsRepository: mockThreadsRepository,
      threadCommentsRepository: mockThreadCommentsRepository,
      threadCommentRepliesRepository: mockThreadCommentRepliesRepository,
    });

    const detailThread = await getThreadDetailUseCase.execute(payload.id);

    expect(detailThread).toStrictEqual(expectedThread);
    expect(mockThreadsRepository.getThreadById).toBeCalledWith(payload.id);

    expect(mockThreadCommentsRepository.getCommentsFromThread).toBeCalledWith(
      payload.id,
    );

    expect(
      mockThreadCommentsRepository.getNumberOfCommentsByThread,
    ).toBeCalledWith(payload.id);

    expect(
      mockThreadCommentRepliesRepository.getRepliesCommentFromThread,
    ).toBeCalledWith(payload.id);
  });
});

/* eslint-disable no-undef */
const pool = require('../../../../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../../../../tests/ThreadCommentRepliesTableTestHelper');
const NewCommentReplies = require('../../../../../../Domains/threads/comments/replies/entities/NewCommentReplies');
const ThreadCommentRepliesRepositoryPostgres = require('../ThreadCommentRepliesRepositoryPostgres');
const AddedCommentReplies = require('../../../../../../Domains/threads/comments/replies/entities/AddedCommentReplies');
const NotFoundError = require('../../../../../../Common/exceptions/NotFoundError');
const AuthorizationError = require('../../../../../../Common/exceptions/AuthorizationError');

describe('ThreadCommentRepliesRepositoryPostgres', () => {
  const firstUser = {
    id: 'user-123',
    username: 'dicoding',
    fullname: 'Dicoding Indonesia',
  };

  const secondUser = {
    id: 'user-1234',
    username: 'akbar',
    fullname: 'Fattahul Akbar',
  };

  const firstCommentReplies = {
    id: 'replies-123',
    comment_id: 'comment-123',
    content: 'replies from dicoding',
    date: new Date(),
    is_deleted: false,
  };

  const secondCommentReplies = {
    id: 'replies-124',
    comment_id: 'comment-123',
    content: 'replies from akbar',
    date: new Date(),
    is_deleted: false,
  };

  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe('addRepliesToComment function', () => {
    it('should persist new replies in comment and return added replies correctly', async () => {
      const newCommentReplies = new NewCommentReplies({
        content: 'replies to comment',
        threadId: 'threads-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, fakeIdGenerator);

      const addedCommentReplies =
        await threadCommentRepliesRepositoryPostgres.addRepliesToComment(
          newCommentReplies,
        );

      const replies = await ThreadCommentRepliesTableTestHelper.findRepliesById(
        'replies-123',
      );

      expect(replies).toHaveLength(1);
      expect(addedCommentReplies).toStrictEqual(
        new AddedCommentReplies({
          id: 'replies-123',
          content: 'replies to comment',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getRepliesCommentFromThread function', () => {
    it('should return empty array when thread comment has no replies', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      const replies =
        await threadCommentRepliesRepositoryPostgres.getRepliesCommentFromThread(
          'threads-123',
        );

      expect(replies).toStrictEqual([]);
    });

    it('should return all thread comment replies correctly', async () => {
      await UsersTableTestHelper.addUser(firstUser);
      await UsersTableTestHelper.addUser(secondUser);
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({
        id: firstCommentReplies.id,
        content: firstCommentReplies.content,
        owner: firstUser.id,
        date: firstCommentReplies.date,
      });

      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({
        id: secondCommentReplies.id,
        content: secondCommentReplies.content,
        owner: secondUser.id,
        date: secondCommentReplies.date,
      });

      const replies =
        await threadCommentRepliesRepositoryPostgres.getRepliesCommentFromThread(
          'threads-123',
        );

      expect(replies).toStrictEqual([
        { ...firstCommentReplies, username: 'dicoding' },
        { ...secondCommentReplies, username: 'akbar' },
      ]);
    });
  });

  describe('deleteRepliesById function', () => {
    it('should return NotFoundError when deleted replies is not available', async () => {
      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      await expect(
        threadCommentRepliesRepositoryPostgres.deleteRepliesById('notfound'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should delete replies correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});
      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({});

      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      await expect(
        threadCommentRepliesRepositoryPostgres.deleteRepliesById('replies-123'),
      ).resolves.not.toThrowError(NotFoundError);

      const replies = await ThreadCommentRepliesTableTestHelper.findRepliesById(
        'replies-123',
      );

      expect(replies[0].is_deleted).toEqual(true);
    });
  });

  describe('verifyRepliesOwner function', () => {
    it('should return AuthorizationError when user is not the replies owner', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});
      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({});

      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      await expect(
        threadCommentRepliesRepositoryPostgres.verifyRepliesOwner(
          'replies-123',
          'user-992',
        ),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should return nothing when user is replies owner', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});
      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({});

      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      await expect(
        threadCommentRepliesRepositoryPostgres.verifyRepliesOwner(
          'replies-123',
          'user-123',
        ),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyAvailableRepliesInThread function', () => {
    it('should return NotFoundError when replies is not available', async () => {
      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      await expect(
        threadCommentRepliesRepositoryPostgres.verifyAvailableRepliesInThread(
          'comment-123',
          'thread-123',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return NotFoundError when replies is not available on thread comment', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: 'comment-123',
        threadId: 'threads-123',
      });

      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: 'comment-124',
        threadId: 'threads-123',
      });

      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({
        id: 'replies-123',
        commentId: 'comment-123',
      });

      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({
        id: 'replies-4',
        commentId: 'comment-124',
      });

      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      await expect(
        threadCommentRepliesRepositoryPostgres.verifyAvailableRepliesInThread(
          'replies-123',
          'comment-124',
          'threads-123',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return NotFoundError when comment is deleted on thread', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({
        is_deleted: true,
      });

      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      await expect(
        threadCommentRepliesRepositoryPostgres.verifyAvailableRepliesInThread(
          'replies-123',
          'comment-123',
          'threads-123',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return empty when comment available on thread', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});
      await ThreadCommentRepliesTableTestHelper.addRepliesToComment({});

      const threadCommentRepliesRepositoryPostgres =
        new ThreadCommentRepliesRepositoryPostgres(pool, {});

      await expect(
        threadCommentRepliesRepositoryPostgres.verifyAvailableRepliesInThread(
          'replies-123',
          'comment-123',
          'threads-123',
        ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});

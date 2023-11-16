/* eslint-disable no-undef */
const pool = require('../../../../database/postgres/pool');
const NewComment = require('../../../../../Domains/threads/comments/entities/NewComment');
const AddedComment = require('../../../../../Domains/threads/comments/entities/AddedComment');
const UsersTableTestHelper = require('../../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsRepositoryPostgres = require('../ThreadCommentsRepositoryPostgres');
const ThreadCommentsTableTestHelper = require('../../../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentLikesTableTestHelper = require('../../../../../../tests/ThreadCommentLikesTableTestHelper');
const NotFoundError = require('../../../../../Common/exceptions/NotFoundError');
const AuthorizationError = require('../../../../../Common/exceptions/AuthorizationError');

describe('ThreadCommentsRepositoryPostgres', () => {
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

  const firstComment = {
    id: 'comment-123',
    date: new Date(),
    content: 'comment from dicoding',
    is_deleted: false,
  };

  const secondComment = {
    id: 'comment-124',
    date: new Date(),
    content: 'comment from akbar',
    is_deleted: false,
  };

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe('addCommentToThread function', () => {
    it('should persist new comment in thread and return added comment correctly', async () => {
      const newComment = new NewComment({
        content: 'comment',
        threadId: 'threads-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment =
        await threadCommentsRepositoryPostgres.addCommentToThread(newComment);

      const comment = await ThreadCommentsTableTestHelper.findCommentById(
        'comment-123',
      );

      expect(comment).toHaveLength(1);
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'comment',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getCommentsFromThread function', () => {
    it('should return empty array when thread has no comments', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      const comment =
        await threadCommentsRepositoryPostgres.getCommentsFromThread(
          'threads-123',
        );

      expect(comment).toStrictEqual([]);
    });

    it('should return all thread comments correctly', async () => {
      await UsersTableTestHelper.addUser(firstUser);
      await UsersTableTestHelper.addUser(secondUser);
      await ThreadsTableTestHelper.addThread({});

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: firstComment.id,
        owner: firstUser.id,
        content: firstComment.content,
        date: firstComment.date,
      });

      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: secondComment.id,
        owner: secondUser.id,
        content: secondComment.content,
        date: secondComment.date,
      });

      const comments =
        await threadCommentsRepositoryPostgres.getCommentsFromThread(
          'threads-123',
        );

      expect(comments).toStrictEqual([
        { ...firstComment, username: 'dicoding' },
        { ...secondComment, username: 'akbar' },
      ]);
    });
  });

  describe('getNumberOfCommentsByThread function', () => {
    it('should return empty array when thread has no comments', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      const comment =
        await threadCommentsRepositoryPostgres.getCommentsFromThread(
          'threads-123',
        );

      expect(comment).toStrictEqual([]);
    });

    it('should return all liked comments correctly', async () => {
      const expectedResult = [
        {
          likes: 1,
          thread_comment_id: 'comment-123',
        },
      ];

      await UsersTableTestHelper.addUser(firstUser);
      await ThreadsTableTestHelper.addThread({});

      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: firstComment.id,
        owner: firstUser.id,
        content: firstComment.content,
        date: firstComment.date,
      });

      await ThreadCommentLikesTableTestHelper.addLikeComment({});

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      const liked =
        await threadCommentsRepositoryPostgres.getNumberOfCommentsByThread(
          'threads-123',
        );

      expect(liked).toStrictEqual(expectedResult);
    });

    it('should return all disliked comments correctly', async () => {
      const expectedResult = [
        {
          likes: 0,
          thread_comment_id: 'comment-123',
        },
      ];

      await UsersTableTestHelper.addUser(firstUser);
      await ThreadsTableTestHelper.addThread({});

      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: firstComment.id,
        owner: firstUser.id,
        content: firstComment.content,
        date: firstComment.date,
      });

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      const liked =
        await threadCommentsRepositoryPostgres.getNumberOfCommentsByThread(
          'threads-123',
        );

      expect(liked).toStrictEqual(expectedResult);
    });
  });

  describe('deleteCommentById function', () => {
    it('should return NotFoundError when deleted comment is not available', async () => {
      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      await expect(
        threadCommentsRepositoryPostgres.deleteCommentById('notfound'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should delete comment correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      await expect(
        threadCommentsRepositoryPostgres.deleteCommentById('comment-123'),
      ).resolves.not.toThrowError(NotFoundError);

      const comment = await ThreadCommentsTableTestHelper.findCommentById(
        'comment-123',
      );

      expect(comment[0].is_deleted).toEqual(true);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return AuthorizationError when user is not the comment owner', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      await expect(
        threadCommentsRepositoryPostgres.verifyCommentOwner(
          'comment-123',
          'user-992',
        ),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should return nothing when user is comment owner', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      await expect(
        threadCommentsRepositoryPostgres.verifyCommentOwner(
          'comment-123',
          'user-123',
        ),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyAvailableCommentInThread function', () => {
    it('should return NotFoundError when thread is not available', async () => {
      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      await expect(
        threadCommentsRepositoryPostgres.verifyAvailableCommentInThread(
          'comment-123',
          'thread-123',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return NotFoundError when comment is not available on thread', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'threads-123' });
      await ThreadsTableTestHelper.addThread({ id: 'threads-124' });

      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: 'comment-123',
        threadId: 'threads-123',
      });

      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: 'comment-124',
        threadId: 'threads-124',
      });

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      await expect(
        threadCommentsRepositoryPostgres.verifyAvailableCommentInThread(
          'comment-123',
          'threads-124',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return NotFoundError when comment is deleted on thread', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      await ThreadCommentsTableTestHelper.addCommentToThread({
        is_deleted: true,
      });

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      await expect(
        threadCommentsRepositoryPostgres.verifyAvailableCommentInThread(
          'comment-123',
          'threads-123',
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return empty when comment available on thread', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const threadCommentsRepositoryPostgres =
        new ThreadCommentsRepositoryPostgres(pool, {});

      await expect(
        threadCommentsRepositoryPostgres.verifyAvailableCommentInThread(
          'comment-123',
          'threads-123',
        ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});

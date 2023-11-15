/* eslint-disable no-undef */
const pool = require('../../../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentLikesTableTestHelper = require('../../../../../../tests/ThreadCommentLikesTableTestHelper');
const ThreadCommentLikesRepositoryPostgres = require('../ThreadCommentLikesRepositoryPostgres');

describe('ThreadCommentLikesRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await ThreadCommentLikesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe('likeComment function', () => {
    it('should persist liked comment correctly', async () => {
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      const fakeIdGenerator = () => '123';

      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const threadCommentLikesRepositoryPostgres =
        new ThreadCommentLikesRepositoryPostgres(pool, fakeIdGenerator);

      await threadCommentLikesRepositoryPostgres.likeComment(payload);

      const liked = await ThreadCommentLikesTableTestHelper.findLikeById(
        'like-123',
      );

      expect(liked).toHaveLength(1);
      expect(liked[0].user_id).toEqual(payload.userId);
      expect(liked[0].comment_id).toEqual(payload.commentId);
    });
  });

  describe('unlikeComment function', () => {
    it('should persist unliked comment correctly', async () => {
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      await ThreadCommentsTableTestHelper.addCommentToThread({});
      await ThreadCommentLikesTableTestHelper.addLikeComment({});

      const threadCommentLikesRepositoryPostgres =
        new ThreadCommentLikesRepositoryPostgres(pool, {});

      await threadCommentLikesRepositoryPostgres.unlikeComment(
        payload.userId,
        payload.commentId,
      );

      const liked = await ThreadCommentLikesTableTestHelper.findLikeById(
        'like-123',
      );

      expect(liked).toHaveLength(0);
    });
  });

  describe('verifyCommentHasBeenLikedOrNot function', () => {
    it('should return false when comment has not been liked', async () => {
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      await ThreadCommentsTableTestHelper.addCommentToThread({});

      const threadCommentLikesRepositoryPostgres =
        new ThreadCommentLikesRepositoryPostgres(pool, {});

      await expect(
        threadCommentLikesRepositoryPostgres.verifyCommentHasBeenLikedOrNot(
          payload.userId,
          payload.commentId,
        ),
      ).resolves.toEqual(false);
    });

    it('should return true when comment has been liked', async () => {
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      await ThreadCommentsTableTestHelper.addCommentToThread({});
      await ThreadCommentLikesTableTestHelper.addLikeComment({});

      const threadCommentLikesRepositoryPostgres =
        new ThreadCommentLikesRepositoryPostgres(pool, {});

      await expect(
        threadCommentLikesRepositoryPostgres.verifyCommentHasBeenLikedOrNot(
          payload.userId,
          payload.commentId,
        ),
      ).resolves.toEqual(true);
    });
  });
  //   it('should return NotFoundError when thread is not available', async () => {
  //     const threadCommentsRepositoryPostgres =
  //       new ThreadCommentsRepositoryPostgres(pool, {});

  //     await expect(
  //       threadCommentsRepositoryPostgres.verifyAvailableCommentInThread(
  //         'comment-123',
  //         'thread-123',
  //       ),
  //     ).rejects.toThrowError(NotFoundError);
  //   });

  //   it('should return NotFoundError when comment is not available on thread', async () => {
  //     await UsersTableTestHelper.addUser({});
  //     await ThreadsTableTestHelper.addThread({ id: 'threads-123' });
  //     await ThreadsTableTestHelper.addThread({ id: 'threads-124' });

  //     await ThreadCommentsTableTestHelper.addCommentToThread({
  //       id: 'comment-123',
  //       threadId: 'threads-123',
  //     });

  //     await ThreadCommentsTableTestHelper.addCommentToThread({
  //       id: 'comment-124',
  //       threadId: 'threads-124',
  //     });

  //     const threadCommentsRepositoryPostgres =
  //       new ThreadCommentsRepositoryPostgres(pool, {});

  //     await expect(
  //       threadCommentsRepositoryPostgres.verifyAvailableCommentInThread(
  //         'comment-123',
  //         'threads-124',
  //       ),
  //     ).rejects.toThrowError(NotFoundError);
  //   });

  //   it('should return NotFoundError when comment is deleted on thread', async () => {
  //     await UsersTableTestHelper.addUser({});
  //     await ThreadsTableTestHelper.addThread({});

  //     await ThreadCommentsTableTestHelper.addCommentToThread({
  //       is_deleted: true,
  //     });

  //     const threadCommentsRepositoryPostgres =
  //       new ThreadCommentsRepositoryPostgres(pool, {});

  //     await expect(
  //       threadCommentsRepositoryPostgres.verifyAvailableCommentInThread(
  //         'comment-123',
  //         'threads-123',
  //       ),
  //     ).rejects.toThrowError(NotFoundError);
  //   });

  //   it('should return empty when comment available on thread', async () => {
  //     await UsersTableTestHelper.addUser({});
  //     await ThreadsTableTestHelper.addThread({});
  //     await ThreadCommentsTableTestHelper.addCommentToThread({});

  //     const threadCommentsRepositoryPostgres =
  //       new ThreadCommentsRepositoryPostgres(pool, {});

  //     await expect(
  //       threadCommentsRepositoryPostgres.verifyAvailableCommentInThread(
  //         'comment-123',
  //         'threads-123',
  //       ),
  //     ).resolves.not.toThrowError(NotFoundError);
  //   });
  // });
});

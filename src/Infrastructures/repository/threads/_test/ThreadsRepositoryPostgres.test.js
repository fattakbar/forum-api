/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const pool = require('../../../database/postgres/pool');
const NewThread = require('../../../../Domains/threads/entities/NewThread');
const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../../Common/exceptions/NotFoundError');

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread functions', () => {
    it('should persist new thread and return added thread correctly', async () => {
      const newThread = new NewThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      await UsersTableTestHelper.addUser({});

      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await threadsRepositoryPostgres.addThread(newThread);

      const thread = await ThreadsTableTestHelper.findThreadById('threads-123');

      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const newThread = new NewThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      await UsersTableTestHelper.addUser({});

      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addedThread = await threadsRepositoryPostgres.addThread(newThread);

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'threads-123',
          title: 'thread title',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      await expect(
        threadsRepositoryPostgres.getThreadById('threads-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});
      const thread = await threadsRepositoryPostgres.getThreadById(
        'threads-123',
      );

      expect(thread.id).toEqual('threads-123');
      expect(thread.title).toEqual('thread title');
      expect(thread.body).toEqual('thread body');
      expect(thread.date.getMinutes()).toEqual(new Date().getMinutes());
      expect(thread.username).toEqual('akbar');
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when tread not found', async () => {
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      await expect(
        threadsRepositoryPostgres.verifyAvailableThread('123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return nothing when thread found', async () => {
      const threadsRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      await expect(
        threadsRepositoryPostgres.verifyAvailableThread('threads-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});

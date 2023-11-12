/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../../Common/exceptions/InvariantError');
const RegisterUser = require('../../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../../Domains/users/entities/RegisteredUser');
const pool = require('../../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username tidak tersedia', async () => {
      await UsersTableTestHelper.addUser({ username: 'akbar' });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(
        userRepositoryPostgres.verifyAvailableUsername('akbar'),
      ).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(
        userRepositoryPostgres.verifyAvailableUsername('akbar'),
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'akbar',
        password: 'secret_password',
        fullname: 'Fattahul Akbar',
      });

      const fakeIdGenerator = () => '123';

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await userRepositoryPostgres.addUser(registerUser);

      const users = await UsersTableTestHelper.findUsersById('user-123');

      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'akbar',
        password: 'secret_password',
        fullname: 'Fattahul Akbar',
      });

      const fakeIdGenerator = () => '123';

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username: 'akbar',
          fullname: 'Fattahul Akbar',
        }),
      );
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      return expect(
        userRepositoryPostgres.getPasswordByUsername('akbar'),
      ).rejects.toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({
        username: 'akbar',
        password: 'secret_password',
      });

      const password = await userRepositoryPostgres.getPasswordByUsername(
        'akbar',
      );

      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(
        userRepositoryPostgres.getIdByUsername('akbar'),
      ).rejects.toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'akbar',
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      const userId = await userRepositoryPostgres.getIdByUsername('akbar');

      expect(userId).toEqual('user-321');
    });
  });
});

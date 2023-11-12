/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Common/exceptions/AuthenticationError');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('encryptPassword function', () => {
    it('should encrypt password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10);
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      await expect(
        bcryptPasswordHash.compare('plain_password', 'encrypted_password'),
      ).rejects.toThrow(AuthenticationError);
    });

    it('should not return AuthenticationError if password match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'secret';
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      await expect(
        bcryptPasswordHash.compare(plainPassword, encryptedPassword),
      ).resolves.not.toThrow(AuthenticationError);
    });
  });
});

/* eslint-disable no-undef */
const Jwt = require('@hapi/jwt');
const config = require('../../../../config/env');
const InvariantError = require('../../../Common/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      const payload = {
        username: 'akbar',
      };

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        config.jwt.token.access,
      );

      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      const payload = {
        username: 'akbar',
      };

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        config.jwt.token.refresh,
      );

      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'akbar',
      });

      await expect(
        jwtTokenManager.verifyRefreshToken(accessToken),
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      const refreshToken = await jwtTokenManager.createRefreshToken({
        username: 'akbar',
      });

      await expect(
        jwtTokenManager.verifyRefreshToken(refreshToken),
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'akbar',
      });

      const { username: expectedUsername } =
        await jwtTokenManager.decodePayload(accessToken);

      expect(expectedUsername).toEqual('akbar');
    });
  });
});

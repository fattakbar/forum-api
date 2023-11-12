const config = require('../../../config/env');
const AuthenticationTokenManager = require('../../Applications/security/AuthenticationTokenManager');
const InvariantError = require('../../Common/exceptions/InvariantError');

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.generate(payload, config.jwt.token.access);
  }

  async createRefreshToken(payload) {
    return this._jwt.generate(payload, config.jwt.token.refresh);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token);

      this._jwt.verify(artifacts, config.jwt.token.refresh);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);

    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;

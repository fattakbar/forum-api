const InvariantError = require('../../../Common/exceptions/InvariantError');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    const insertTokenQuery = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };

    await this._pool.query(insertTokenQuery);
  }

  async checkAvailabilityToken(token) {
    const checkTokenQuery = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(checkTokenQuery);

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token) {
    const deleteTokenQuery = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(deleteTokenQuery);
  }
}

module.exports = AuthenticationRepositoryPostgres;

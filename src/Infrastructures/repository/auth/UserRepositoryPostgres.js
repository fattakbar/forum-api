const InvariantError = require('../../../Common/exceptions/InvariantError');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const checkUsernameQuery = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(checkUsernameQuery);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const insertUserQuery = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(insertUserQuery);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username) {
    const getUserPasswordQuery = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(getUserPasswordQuery);

    if (!result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const getUserIdQuery = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(getUserIdQuery);

    if (!result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }

    const { id } = result.rows[0];

    return id;
  }
}

module.exports = UserRepositoryPostgres;

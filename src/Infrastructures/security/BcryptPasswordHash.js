const PasswordHash = require('../../Applications/security/PasswordHash');
const AuthenticationError = require('../../Common/exceptions/AuthenticationError');

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async compare(password, hashedPassword) {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError(
        'the credentials you entered are incorrect',
      );
    }
  }
}

module.exports = BcryptPasswordHash;

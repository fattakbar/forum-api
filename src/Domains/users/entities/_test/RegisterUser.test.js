/* eslint-disable no-undef */
const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'akbar',
      password: 'secret_password',
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 321,
      fullname: true,
      password: 'secret_password',
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when username contains more than 50 character', () => {
    const payload = {
      username:
        'gildedtestergildedtestergildedtestergildedtestergildedtestergildedtestergildedtester',
      fullname: 'Fattahul Akbar',
      password: 'secret_password',
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.USERNAME_LIMIT_CHAR',
    );
  });

  it('should throw error when username contains restricted character', () => {
    const payload = {
      username: 'ak bar',
      fullname: 'Fattahul Akbar',
      password: 'secret_password',
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER',
    );
  });

  it('should create registerUser object correctly', () => {
    const payload = {
      username: 'akbar',
      fullname: 'Fattahul Akbar',
      password: 'secret_password',
    };

    const { username, fullname, password } = new RegisterUser(payload);

    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});

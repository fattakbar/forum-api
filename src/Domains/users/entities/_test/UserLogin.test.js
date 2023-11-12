/* eslint-disable no-undef */
const UserLogin = require('../UserLogin');

describe('UserLogin entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      username: 'akbar',
    };

    expect(() => new UserLogin(payload)).toThrowError(
      'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      username: 'akbar',
      password: 54321,
    };

    expect(() => new UserLogin(payload)).toThrowError(
      'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create UserLogin entities correctly', () => {
    const payload = {
      username: 'akbar',
      password: 'secret_password',
    };

    const userLogin = new UserLogin(payload);

    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});

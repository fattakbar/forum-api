/* eslint-disable no-undef */
const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'cannot create a new user because the required property does not exist',
      ),
    );

    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'unable to create a new user because the data type does not match',
      ),
    );

    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'cannot create a new user because the username character exceeds the limit',
      ),
    );

    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      ),
    );
  });

  it('should return original error when error message is not needed to translate', () => {
    const error = new Error('some_error_message');
    const translatedError = DomainErrorTranslator.translate(error);

    expect(translatedError).toStrictEqual(error);
  });
});

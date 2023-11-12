const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'cannot create a new user because the required property does not exist',
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'unable to create a new user because the data type does not match',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'cannot create a new user because the username character exceeds the limit',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'must submit username and password',
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username and password must be of string data type',
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('should send a refresh token'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token must be of type string data'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('should send a refresh token'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token must be of type string data'),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'cannot create a new thread because the required property does not exist',
  ),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'unable to create a new thread because the data type does not match',
  ),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'cannot create a new comment because the required property does not exist',
  ),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'unable to create a new comment because the data type does not match',
  ),
  'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'cannot delete comment because the required property does not exist',
  ),
  'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'unable delete comment because the data type does not match',
  ),
  'NEW_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'cannot create a new comment replies because the required property does not exist',
  ),
  'NEW_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'unable to create a new comment replies because the data type does not match',
  ),
  'DELETE_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'cannot delete comment replies because the required property does not exist',
  ),
  'DELETE_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'unable delete comment replies because the data type does not match',
  ),
};

module.exports = DomainErrorTranslator;

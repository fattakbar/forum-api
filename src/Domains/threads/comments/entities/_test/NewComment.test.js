/* eslint-disable no-undef */
const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'comment',
      threadId: 'threads-123',
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: true,
      threadId: 'threads-123',
      owner: 'user-123',
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create newComment object correctly', () => {
    const payload = {
      content: 'comment',
      threadId: 'threads-123',
      owner: 'user-123',
    };

    const newComment = new NewComment(payload);

    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });
});

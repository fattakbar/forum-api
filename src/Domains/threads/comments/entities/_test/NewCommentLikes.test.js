/* eslint-disable no-undef */
const NewCommentLikes = require('../NewCommentLikes');

describe('a NewCommentLikes entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: true,
    };

    expect(() => new NewCommentLikes(payload)).toThrowError(
      'NEW_COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: true,
      commentId: 'comment-123',
      userId: 'user-123',
    };

    expect(() => new NewCommentLikes(payload)).toThrowError(
      'NEW_COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create newCommentLikes object correctly', () => {
    const payload = {
      threadId: 'threads-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const newCommentLikes = new NewCommentLikes(payload);

    expect(newCommentLikes.threadId).toEqual(payload.threadId);
    expect(newCommentLikes.commentId).toEqual(payload.commentId);
    expect(newCommentLikes.userId).toEqual(payload.userId);
  });
});

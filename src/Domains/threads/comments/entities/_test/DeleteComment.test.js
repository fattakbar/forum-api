/* eslint-disable no-undef */
const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
    };

    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      commentId: 'comment-123',
      threadId: 'threads-123',
      userId: 1,
    };

    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create deleteComment object correctly', () => {
    const payload = {
      commentId: 'comment-123',
      threadId: 'threads-123',
      userId: 'user-123',
    };

    const deleteComment = new DeleteComment(payload);

    expect(deleteComment.commentId).toEqual(payload.commentId);
    expect(deleteComment.threadId).toEqual(payload.threadId);
    expect(deleteComment.userId).toEqual(payload.userId);
  });
});

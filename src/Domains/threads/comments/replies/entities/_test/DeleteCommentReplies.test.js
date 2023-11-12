/* eslint-disable no-undef */
const DeleteCommentReplies = require('../DeleteCommentReplies');

describe('a DeleteCommentReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      repliesId: 'replies-123',
    };

    expect(() => new DeleteCommentReplies(payload)).toThrowError(
      'DELETE_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      repliesId: 'replies-123',
      commentId: 'comment-123',
      threadId: true,
      userId: 1,
    };

    expect(() => new DeleteCommentReplies(payload)).toThrowError(
      'DELETE_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create deleteCommentReplies object correctly', () => {
    const payload = {
      repliesId: 'replies-123',
      commentId: 'comment-123',
      threadId: 'threads-123',
      userId: 'user-123',
    };

    const deleteCommentReplies = new DeleteCommentReplies(payload);

    expect(deleteCommentReplies.repliesId).toEqual(payload.repliesId);
    expect(deleteCommentReplies.commentId).toEqual(payload.commentId);
    expect(deleteCommentReplies.threadId).toEqual(payload.threadId);
    expect(deleteCommentReplies.userId).toEqual(payload.userId);
  });
});

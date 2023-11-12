/* eslint-disable no-undef */
const NewCommentReplies = require('../NewCommentReplies');

describe('a NewCommentReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'comment',
      threadId: 'threads-123',
    };

    expect(() => new NewCommentReplies(payload)).toThrowError(
      'NEW_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 'comment',
      threadId: 'threads-123',
      commentId: 'comment-123',
      owner: 1,
    };

    expect(() => new NewCommentReplies(payload)).toThrowError(
      'NEW_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create newCommentReplies object correctly', () => {
    const payload = {
      content: 'content',
      threadId: 'threads-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const newCommentReplies = new NewCommentReplies(payload);

    expect(newCommentReplies.content).toEqual(payload.content);
    expect(newCommentReplies.threadId).toEqual(payload.threadId);
    expect(newCommentReplies.commentId).toEqual(payload.commentId);
    expect(newCommentReplies.owner).toEqual(payload.owner);
  });
});

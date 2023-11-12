/* eslint-disable no-undef */
const AddedCommentReplies = require('../AddedCommentReplies');

describe('a AddedCommentReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'replies-123',
    };

    expect(() => new AddedCommentReplies(payload)).toThrowError(
      'ADDED_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'replies-123',
      content: 'comment',
      owner: 1,
    };

    expect(() => new AddedCommentReplies(payload)).toThrowError(
      'ADDED_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create addedCommentReplies object correctly', () => {
    const payload = {
      id: 'replies-123',
      content: 'comment',
      owner: 'user-123',
    };

    const addedCommentReplies = new AddedCommentReplies(payload);

    expect(addedCommentReplies.id).toEqual(payload.id);
    expect(addedCommentReplies.content).toEqual(payload.content);
    expect(addedCommentReplies.owner).toEqual(payload.owner);
  });
});

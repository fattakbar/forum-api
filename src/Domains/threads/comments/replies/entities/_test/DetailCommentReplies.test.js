/* eslint-disable no-undef */
const DetailCommentReplies = require('../DetailCommentReplies');

describe('a DetailCommentReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'replies-123',
    };

    expect(() => new DetailCommentReplies(payload)).toThrowError(
      'DETAIL_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'replies-123',
      content: 'comment',
      date: new Date(),
      username: 'akbar',
      is_deleted: 'true',
    };

    expect(() => new DetailCommentReplies(payload)).toThrowError(
      'DETAIL_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create detailCommentReplies object correctly', () => {
    const payload = {
      id: 'replies-123',
      content: 'comment',
      date: new Date(),
      username: 'akbar',
      is_deleted: false,
    };

    const detailCommentReplies = new DetailCommentReplies(payload);

    expect(detailCommentReplies.id).toEqual(payload.id);
    expect(detailCommentReplies.content).toEqual(payload.content);
    expect(detailCommentReplies.date).toEqual(payload.date);
    expect(detailCommentReplies.username).toEqual(payload.username);
  });

  it('should create detailCommentReplies object correctly with deleted content', () => {
    const payload = {
      id: 'replies-123',
      content: 'comment',
      date: new Date(),
      username: 'akbar',
      is_deleted: true,
    };

    const detailCommentReplies = new DetailCommentReplies(payload);

    expect(detailCommentReplies.id).toEqual(payload.id);
    expect(detailCommentReplies.content).toEqual('**balasan telah dihapus**');
    expect(detailCommentReplies.date).toEqual(payload.date);
    expect(detailCommentReplies.username).toEqual(payload.username);
  });
});

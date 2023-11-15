/* eslint-disable no-undef */
const DetailCommentLikes = require('../DetailCommentLikes');

describe('a DetailCommentLikes entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new DetailCommentLikes(payload)).toThrowError(
      'DETAIL_COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      likes: '2',
    };

    expect(() => new DetailCommentLikes(payload)).toThrowError(
      'DETAIL_COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create detailCommentLikes object correctly', () => {
    const payload = {
      likes: 2,
    };

    const detailCommentLikes = new DetailCommentLikes(payload);

    expect(detailCommentLikes.likes).toEqual(payload.likes);
  });
});

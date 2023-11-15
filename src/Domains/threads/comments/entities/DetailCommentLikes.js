/* eslint-disable class-methods-use-this */
class DetailCommentLikes {
  constructor(payload) {
    this._verifyPayload(payload);

    this.likes = payload.likes;
  }

  _verifyPayload({ likes }) {
    if (!likes) {
      throw new Error('DETAIL_COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof likes !== 'number') {
      throw new Error('DETAIL_COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailCommentLikes;

/* eslint-disable class-methods-use-this */
class NewCommentLikes {
  constructor(payload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.userId = payload.userId;
  }

  _verifyPayload({ threadId, commentId, userId }) {
    if (!threadId || !commentId || !userId) {
      throw new Error('NEW_COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('NEW_COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewCommentLikes;

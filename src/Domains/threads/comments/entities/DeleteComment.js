/* eslint-disable class-methods-use-this */
class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.commentId = payload.commentId;
    this.threadId = payload.threadId;
    this.userId = payload.userId;
  }

  _verifyPayload({ commentId, threadId, userId }) {
    if (!commentId || !threadId || !userId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof commentId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;

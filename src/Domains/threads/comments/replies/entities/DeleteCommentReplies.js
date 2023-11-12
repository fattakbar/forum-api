/* eslint-disable class-methods-use-this */
class DeleteCommentReplies {
  constructor(payload) {
    this._verifyPayload(payload);

    this.repliesId = payload.repliesId;
    this.commentId = payload.commentId;
    this.threadId = payload.threadId;
    this.userId = payload.userId;
  }

  _verifyPayload({ repliesId, commentId, threadId, userId }) {
    if (!repliesId || !commentId || !threadId || !userId) {
      throw new Error('DELETE_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof repliesId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error(
        'DELETE_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = DeleteCommentReplies;

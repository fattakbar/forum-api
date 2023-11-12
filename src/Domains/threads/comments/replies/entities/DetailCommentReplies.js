/* eslint-disable class-methods-use-this */
class DetailCommentReplies {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.is_deleted
      ? '**balasan telah dihapus**'
      : payload.content;
    this.date = payload.date;
    this.username = payload.username;
  }

  _verifyPayload({ id, content, date, username, is_deleted: isDeleted }) {
    if (!id || !content || !date || !username) {
      throw new Error('DETAIL_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      !(date instanceof Date) ||
      typeof username !== 'string' ||
      typeof isDeleted !== 'boolean'
    ) {
      throw new Error(
        'DETAIL_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = DetailCommentReplies;

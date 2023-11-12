/* eslint-disable class-methods-use-this */
class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.is_deleted
      ? '**komentar telah dihapus**'
      : payload.content;
  }

  _verifyPayload({ id, username, date, content, is_deleted: isDeleted }) {
    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      !(date instanceof Date) ||
      typeof username !== 'string' ||
      typeof isDeleted !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;

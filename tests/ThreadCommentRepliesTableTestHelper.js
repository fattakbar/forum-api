/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTableTestHelper = {
  async addRepliesToComment({
    id = 'replies-123',
    commentId = 'comment-123',
    content = 'comment replies',
    owner = 'user-123',
    is_deleted = false,
    date = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, commentId, content, owner, is_deleted, date],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_replies WHERE 1=1');
  },
};

module.exports = ThreadCommentRepliesTableTestHelper;

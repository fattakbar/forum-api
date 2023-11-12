/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addCommentToThread({
    id = 'comment-123',
    threadId = 'threads-123',
    content = 'comment',
    owner = 'user-123',
    is_deleted = false,
    date = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, content, owner, is_deleted, date],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  },
};

module.exports = ThreadCommentsTableTestHelper;

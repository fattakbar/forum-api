const AuthorizationError = require('../../../../../Common/exceptions/AuthorizationError');
const NotFoundError = require('../../../../../Common/exceptions/NotFoundError');
const ThreadCommentRepliesRepository = require('../../../../../Domains/threads/comments/replies/ThreadCommentRepliesRepository');
const AddedCommentReplies = require('../../../../../Domains/threads/comments/replies/entities/AddedCommentReplies');

class ThreadCommentRepliesRepositoryPostgres extends ThreadCommentRepliesRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addRepliesToComment(newReplies) {
    const id = `replies-${this._idGenerator()}`;
    const { content, commentId, owner } = newReplies;

    const insertRepliesToCommentQuery = await this._pool.query({
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, commentId, content, owner],
    });

    return new AddedCommentReplies(insertRepliesToCommentQuery.rows[0]);
  }

  async getRepliesCommentFromThread(threadId) {
    const listOfRepliesQuery = await this._pool.query({
      text: `SELECT tcr.id, tcr.comment_id, tcr.content, tcr.date, us.username, tcr.is_deleted 
        FROM thread_comment_replies AS tcr 
        JOIN users AS us ON tcr.owner = us.id
        JOIN thread_comments AS tc ON tcr.comment_id = tc.id
        WHERE tc.thread_id = $1 
        ORDER BY tc.date, tcr.date`,
      values: [threadId],
    });

    const { rows } = listOfRepliesQuery;

    return rows;
  }

  async deleteRepliesById(repliesId) {
    const deleteRepliesInCommentQuery = await this._pool.query({
      text: 'UPDATE thread_comment_replies SET is_deleted = TRUE WHERE id = $1',
      values: [repliesId],
    });

    const { rowCount } = deleteRepliesInCommentQuery;

    if (!rowCount)
      throw new NotFoundError(
        'failed to delete replies comment, replies comment not found',
      );
  }

  async verifyRepliesOwner(repliesId, owner) {
    const checkRepliesOwnerQuery = await this._pool.query({
      text: 'SELECT owner FROM thread_comment_replies WHERE id = $1 AND owner = $2',
      values: [repliesId, owner],
    });

    const { rowCount } = checkRepliesOwnerQuery;

    if (!rowCount)
      throw new AuthorizationError(
        'you are not authorized to access this resource',
      );
  }

  async verifyAvailableRepliesInThread(repliesId, commentId, threadId) {
    const threadCommentRepliesCheckQuery = await this._pool.query({
      text: `SELECT tcr.id FROM thread_comment_replies as tcr
      JOIN thread_comments AS tc ON tcr.comment_id = tc.id
      WHERE tcr.id = $1 
      AND tcr.comment_id = $2 
      AND tc.thread_id = $3 
      AND tcr.is_deleted = FALSE`,
      values: [repliesId, commentId, threadId],
    });

    const { rowCount } = threadCommentRepliesCheckQuery;

    if (!rowCount)
      throw new NotFoundError('there are no replies on this comment');
  }
}

module.exports = ThreadCommentRepliesRepositoryPostgres;

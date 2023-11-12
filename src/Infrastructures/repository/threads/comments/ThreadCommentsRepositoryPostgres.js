const AuthorizationError = require('../../../../Common/exceptions/AuthorizationError');
const NotFoundError = require('../../../../Common/exceptions/NotFoundError');
const ThreadCommentsRepository = require('../../../../Domains/threads/comments/ThreadCommentsRepository');
const AddedComment = require('../../../../Domains/threads/comments/entities/AddedComment');

class ThreadCommentsRepositoryPostgres extends ThreadCommentsRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentToThread(newComment) {
    const id = `comment-${this._idGenerator()}`;
    const { content, threadId, owner } = newComment;

    const insertCommentToThreadQuery = await this._pool.query({
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    });

    return new AddedComment(insertCommentToThreadQuery.rows[0]);
  }

  async getCommentsFromThread(threadId) {
    const listOfCommentsQuery = await this._pool.query({
      text: `SELECT tc.id, us.username, tc.date, tc.content, tc.is_deleted 
        FROM thread_comments AS tc 
        JOIN users AS us 
        ON tc.owner = us.id 
        WHERE tc.thread_id = $1 
        ORDER BY tc.date`,
      values: [threadId],
    });

    const { rows } = listOfCommentsQuery;

    return rows;
  }

  async deleteCommentById(commentId) {
    const deleteCommentInThreadQuery = await this._pool.query({
      text: 'UPDATE thread_comments SET is_deleted = TRUE WHERE id = $1',
      values: [commentId],
    });

    const { rowCount } = deleteCommentInThreadQuery;

    if (!rowCount)
      throw new NotFoundError('failed to delete comment, comment not found');
  }

  async verifyCommentOwner(commentId, owner) {
    const checkCommentOwnerQuery = await this._pool.query({
      text: 'SELECT owner FROM thread_comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    });

    const { rowCount } = checkCommentOwnerQuery;

    if (!rowCount)
      throw new AuthorizationError(
        'you are not authorized to access this resource',
      );
  }

  async verifyAvailableCommentInThread(commentId, threadId) {
    const threadCommentCheckQuery = await this._pool.query({
      text: 'SELECT id FROM thread_comments WHERE id = $1 AND thread_id = $2 AND is_deleted = FALSE',
      values: [commentId, threadId],
    });

    const { rowCount } = threadCommentCheckQuery;

    if (!rowCount)
      throw new NotFoundError('there are no comments on this thread');
  }
}

module.exports = ThreadCommentsRepositoryPostgres;

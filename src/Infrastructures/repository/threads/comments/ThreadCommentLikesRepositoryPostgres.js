const ThreadCommentLikesRepository = require('../../../../Domains/threads/comments/ThreadCommentLikesRepository');

class ThreadCommentLikesRepositoryPostgres extends ThreadCommentLikesRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeComment(newCommentLikes) {
    const id = `like-${this._idGenerator()}`;
    const { commentId, userId } = newCommentLikes;

    await this._pool.query({
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [id, userId, commentId],
    });
  }

  async unlikeComment(userId, commentId) {
    await this._pool.query({
      text: 'DELETE FROM thread_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    });
  }

  async verifyCommentHasBeenLikedOrNot(userId, commentId) {
    const checkCommentHasBeenLikedOrNotQuery = await this._pool.query({
      text: 'SELECT id FROM thread_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    });

    const { rowCount } = checkCommentHasBeenLikedOrNotQuery;

    if (!rowCount) {
      return false;
    }

    return true;
  }
}

module.exports = ThreadCommentLikesRepositoryPostgres;

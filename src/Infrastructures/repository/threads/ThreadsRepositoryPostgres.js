const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Common/exceptions/NotFoundError');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

class ThreadsRepositoryPostgres extends ThreadsRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const id = `threads-${this._idGenerator()}`;
    const { title, body, owner } = newThread;

    const insertThreadQuery = await this._pool.query({
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    });

    return new AddedThread(insertThreadQuery.rows[0]);
  }

  async getThreadById(threadId) {
    const threadQuery = await this._pool.query({
      text: `SELECT th.id, th.title, th.body, th.date, us.username 
        FROM threads AS th 
        JOIN users AS us 
        ON th.owner = us.id 
        WHERE th.id = $1 
        GROUP BY th.id, us.username`,
      values: [threadId],
    });

    const { rows, rowCount } = threadQuery;

    if (!rowCount) {
      throw new NotFoundError('thread not found');
    }

    return new DetailThread({ ...rows[0] });
  }

  async verifyAvailableThread(threadId) {
    const threadCheckQuery = await this._pool.query({
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    });

    const { rowCount } = threadCheckQuery;

    if (!rowCount) throw new NotFoundError('thread not found');
  }
}

module.exports = ThreadsRepositoryPostgres;

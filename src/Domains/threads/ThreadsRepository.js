/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

class ThreadsRepository {
  async addThread(newThread) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadById(threadId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableThread(threadId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadsRepository;

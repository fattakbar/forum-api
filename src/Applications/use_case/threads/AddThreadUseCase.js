const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadsRepository }) {
    this._threadsRepository = threadsRepository;
  }

  async execute(payload) {
    const newThread = new NewThread(payload);

    return this._threadsRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;

/* eslint-disable no-undef */
const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository');
const NewThread = require('../../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestracting the add thread action correctly', async () => {
    const payload = {
      title: 'thread title',
      body: 'thread body',
      owner: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'threads-123',
      title: payload.title,
      owner: payload.owner,
    });

    const mockThreadRepository = new ThreadsRepository();

    mockThreadRepository.addThread = jest.fn(() =>
      Promise.resolve(mockAddedThread),
    );

    const addThreadUseCase = new AddThreadUseCase({
      threadsRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(payload);

    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread(payload),
    );
  });
});

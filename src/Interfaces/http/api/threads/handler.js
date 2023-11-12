const autoBind = require('auto-bind');
const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/threads/GetThreadDetailUseCase');
const { successResponse } = require('../../../../../config/helper');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const payload = {
      ...request.payload,
      owner: request.auth.credentials.id,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(payload);

    return successResponse(h, {
      responseData: { addedThread },
      responseCode: 201,
    });
  }

  async getThreadByIdHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name,
    );

    const thread = await getThreadDetailUseCase.execute(request.params.id);

    return successResponse(h, {
      responseData: { thread },
    });
  }
}

module.exports = ThreadsHandler;

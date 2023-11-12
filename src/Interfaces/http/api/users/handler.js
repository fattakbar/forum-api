const autoBind = require('auto-bind');
const AddUserUseCase = require('../../../../Applications/use_case/auth/AddUserUseCase');
const { successResponse } = require('../../../../../config/helper');

class UsersHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postUserHandler({ payload }, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(payload);

    return successResponse(h, {
      responseData: { addedUser },
      responseCode: 201,
    });
  }
}

module.exports = UsersHandler;

const autoBind = require('auto-bind');
const LoginUserUseCase = require('../../../../Applications/use_case/auth/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/auth/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/auth/LogoutUserUseCase');
const { successResponse } = require('../../../../../config/helper');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postAuthenticationHandler({ payload }, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);

    const { accessToken, refreshToken } = await loginUserUseCase.execute(
      payload,
    );

    return successResponse(h, {
      responseData: { accessToken, refreshToken },
      responseCode: 201,
    });
  }

  async putAuthenticationHandler({ payload }, h) {
    const refreshAuthenticationUseCase = this._container.getInstance(
      RefreshAuthenticationUseCase.name,
    );

    const accessToken = await refreshAuthenticationUseCase.execute(payload);

    return successResponse(h, {
      responseData: { accessToken },
    });
  }

  async deleteAuthenticationHandler({ payload }, h) {
    const logoutUserUseCase = this._container.getInstance(
      LogoutUserUseCase.name,
    );

    await logoutUserUseCase.execute(payload);

    return successResponse(h, {
      responseMessage: 'Refresh token removed successfully',
    });
  }
}

module.exports = AuthenticationsHandler;

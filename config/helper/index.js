const successResponse = (
  h,
  { responseMessage = '', responseData, responseCode = 200 },
) => {
  const response = {
    status: 'success',
  };

  if (responseMessage) {
    response.message = responseMessage;
  }

  if (responseData) {
    response.data = responseData;
  }

  return h.response(response).code(responseCode);
};

const failResponse = (h, responseMessage, responseCode) =>
  h
    .response({
      status: 'fail',
      message: responseMessage,
    })
    .code(responseCode);

const errorResponse = (h, response) =>
  h
    .response({
      status: 'error',
      message: 'there was a failure on our server.',
      error: {
        name: response.name,
        message: response.message,
      },
    })
    .code(500);

module.exports = { successResponse, failResponse, errorResponse };

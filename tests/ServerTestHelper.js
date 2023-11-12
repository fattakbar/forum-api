/* istanbul ignore file */

module.exports = {
  async getCredentialsUser({ server, username = 'akbar' }) {
    const userPayload = {
      username,
      password: 'super_secret',
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: 'Fattahul Akbar',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const { id: userId } = JSON.parse(responseUser.payload).data.addedUser;
    const { accessToken } = JSON.parse(responseAuth.payload).data;

    return { userId, accessToken };
  },
};

/* istanbul ignore file */
const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/auth/AuthenticationRepositoryPostgres');

const UserRepository = require('../Domains/users/UserRepository');
const UserRepositoryPostgres = require('./repository/auth/UserRepositoryPostgres');

const ThreadsRepository = require('../Domains/threads/ThreadsRepository');
const ThreadsRepositoryPostgres = require('./repository/threads/ThreadsRepositoryPostgres');

const ThreadCommentsRepository = require('../Domains/threads/comments/ThreadCommentsRepository');
const ThreadCommentsRepositoryPostgres = require('./repository/threads/comments/ThreadCommentsRepositoryPostgres');

const ThreadCommentRepliesRepository = require('../Domains/threads/comments/replies/ThreadCommentRepliesRepository');
const ThreadCommentRepliesRepositoryPostgres = require('./repository/threads/comments/replies/ThreadCommentRepliesRepositoryPostgres');

const PasswordHash = require('../Applications/security/PasswordHash');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');

const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');

// use case
const LoginUserUseCase = require('../Applications/use_case/auth/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/auth/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../Applications/use_case/auth/LogoutUserUseCase');
const AddUserUseCase = require('../Applications/use_case/auth/AddUserUseCase');
const AddThreadUseCase = require('../Applications/use_case/threads/AddThreadUseCase');
const GetThreadDetailUseCase = require('../Applications/use_case/threads/GetThreadDetailUseCase');
const AddCommentToThreadUseCase = require('../Applications/use_case/threads/comments/AddCommentToThreadUseCase');
const DeleteCommentFromThreadUseCase = require('../Applications/use_case/threads/comments/DeleteCommentFromThreadUseCase');
const AddRepliesToCommentUseCase = require('../Applications/use_case/threads/comments/replies/AddRepliesToCommentUseCase');
const DeleteRepliesFromCommentUseCase = require('../Applications/use_case/threads/comments/replies/DeleteRepliesFromCommentUseCase');

// create container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadsRepository.name,
    Class: ThreadsRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadCommentsRepository.name,
    Class: ThreadCommentsRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadCommentRepliesRepository.name,
    Class: ThreadCommentRepliesRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
      ],
    },
  },
  {
    key: GetThreadDetailUseCase.name,
    Class: GetThreadDetailUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
        {
          name: 'threadCommentsRepository',
          internal: ThreadCommentsRepository.name,
        },
        {
          name: 'threadCommentRepliesRepository',
          internal: ThreadCommentRepliesRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentToThreadUseCase.name,
    Class: AddCommentToThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentsRepository',
          internal: ThreadCommentsRepository.name,
        },
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentFromThreadUseCase.name,
    Class: DeleteCommentFromThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentsRepository',
          internal: ThreadCommentsRepository.name,
        },
      ],
    },
  },
  {
    key: AddRepliesToCommentUseCase.name,
    Class: AddRepliesToCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentRepliesRepository',
          internal: ThreadCommentRepliesRepository.name,
        },
        {
          name: 'threadCommentsRepository',
          internal: ThreadCommentsRepository.name,
        },
        {
          name: 'threadsRepository',
          internal: ThreadsRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteRepliesFromCommentUseCase.name,
    Class: DeleteRepliesFromCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentRepliesRepository',
          internal: ThreadCommentRepliesRepository.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
]);

module.exports = container;

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  postgres: {
    db: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    pass: process.env.PGPASSWORD,
  },
  postgresTest: {
    db: process.env.PGDATABASE_TEST,
    host: process.env.PGHOST_TEST,
    port: process.env.PGPORT_TEST,
    user: process.env.PGUSER_TEST,
    pass: process.env.PGPASSWORD_TEST,
  },
  jwt: {
    token: {
      access: process.env.ACCESS_TOKEN_KEY,
      refresh: process.env.REFRESH_TOKEN_KEY,
    },
    age: process.env.ACCESS_TOKEN_AGE,
  },
};

module.exports = config;

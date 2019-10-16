module.exports = {
  development: {
    username: 'root',
    password: 'toor',
    database: 'stockbit_development',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
  },
  test: {
    username: 'root',
    password: 'toor',
    database: 'stockbit_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false
  }
}

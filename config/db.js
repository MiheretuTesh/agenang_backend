const Sequelize = require("sequelize");

const connection = require("./connection");

let database;

switch (process.env.NODE_ENV) {
  case "development":
    database = new Sequelize(
      connection.development.database,
      connection.development.user,
      connection.development.password,
      {
        host: connection.development.host,
        dialect: "mysql",
        operatorsAliases: false,

        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
    break;
  case "production":
    database = new Sequelize(
      connection.development.database,
      connection.development.user,
      connection.development.password,
      {
        host: connection.development.host,
        dialect: "mysql",
        operatorsAliases: false,

        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
    break;
  case "testing":
    database = new Sequelize(
      connection.development.database,
      connection.development.user,
      connection.development.password,
      {
        host: connection.development.host,
        dialect: "mysql",
      }
    );
    break;
  default:
    database = new Sequelize(
      connection.development.database,
      connection.development.user,
      connection.development.password,
      {
        host: connection.development.host,
        dialect: "mysql",
        operatorsAliases: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
}

module.exports = database;

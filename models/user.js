const { Sequelize, DataTypes } = require("sequelize");
const bcryptService = require("../services/bcrypt.service");
const sequelize = require("../config/db");

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user);
  },
};

const tableName = "users";

const User = sequelize.define(
  "User",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter your name",
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter your email",
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please password",
        },
      },
    },
    phoneNumber: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter your phone number",
        },
      },
    },
    image: {
      type: Sequelize.BLOB,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  { hooks, tableName }
);

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;

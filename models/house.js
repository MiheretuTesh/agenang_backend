const { Sequelize, DataTypes } = require("sequelize");
const User = require("./user");

const sequelize = require("../config/db");

const tableName = "houses";

const House = sequelize.define(
  "House",
  {
    bedNo: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Number of Bed",
        },
      },
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Location",
        },
      },
    },

    floor: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Floor",
        },
      },
    },
    monthlyPayment: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Monthly Payment",
        },
      },
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Phone Number",
        },
      },
    },
    availabilityDate: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter The Availability Date",
        },
      },
    },
    guestHouse: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    images: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Description",
        },
      },
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    listingStatus: {
      type: Sequelize.STRING,
    },
    reviewStatus: {
      type: Sequelize.STRING,
    },
  },
  { tableName }
);

House.belongsTo(User, { foreignKey: "userId" });
User.hasMany(House, { foreignKey: "userId" });

module.exports = House;

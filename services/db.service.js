const database = require("../config/db");

const dbService = (environment, migrate) => {
  const authenticateDB = () => database.authenticate();

  const dropDatabase = () => database.drop();

  const syncDatabase = () => database.sync();

  const successfulDBStart = () => {
    console.log("connection to database is established successfully.");
  };

  const errorDBStart = (err) => {
    console.log("Unable to connect to the database", err);
  };

  const wrongEnvironment = () => {
    console.log(
      `only development, staging, test and production are valid NODE_ENV variables but ${environment} is specified`
    );
    return process.exit(1);
  };

  const startDBMigrateTrue = async () => {
    try {
      await syncDatabase();
      successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startDBMigrateFalse = async () => {
    try {
      await dropDatabase();
      await syncDatabase();
      successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startDevelopment = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        return startDBMigrateTrue();
      }
      return startDBMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startStage = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        return startDBMigrateTrue();
      }
      return startDBMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startTesting = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        return startDBMigrateTrue();
      }
      return startDBMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startProduction = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        return startDBMigrateTrue();
      }
      return startDBMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const start = async () => {
    switch (environment) {
      case "development":
        await startDevelopment();
        break;
      case "stage":
        await startStage();
        break;
      case "testing":
        await startTesting();
        break;
      case "production":
        await startProduction();
        break;
      default:
        await wrongEnvironment();
    }
  };

  return { start };
};

module.exports = dbService;

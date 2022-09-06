const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const logger = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");

const app = express();
dotenv.config({ path: "./.env" });

const environment = process.env.NODE_ENV;

const dbService = require("./services/db.service");

const DB = dbService(environment, true).start();

const auth = require("./routes/auth");
const user = require("./routes/user");
const house = require("./routes/house");

app.use(cors());

app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/houses", house);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port: ${port}`));

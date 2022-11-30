const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const logger = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
var cookieParser = require("cookie-parser");

const app = express();
dotenv.config({ path: "./.env" });

const environment = process.env.NODE_ENV;

const dbService = require("./services/db.service");

const DB = dbService(environment, true).start();

const auth = require("./routes/auth");
const user = require("./routes/user");
const house = require("./routes/house");
const dashboard = require("./routes/dashboard");

app.use(
  cors({
    allowedHeaders: ["x-access-token", "Content-Type"],
    origin: "*",
    credentials: true,
    preflightContinue: true,
  })
);

app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/houses", house);
app.use("/api/v1/dashboard", dashboard);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port: ${port}`));

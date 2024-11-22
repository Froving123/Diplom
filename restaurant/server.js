const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/index");

const server = express();
const PORT = 5000;
server.use(cors());
server.use(bodyParser.json());
server.use("/api", router);

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

conn.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db connected");
  }
});

server.listen(PORT, () => {
  console.log("server started");
});

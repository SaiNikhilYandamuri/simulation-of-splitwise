const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const con = mysql.createConnection({
  host: "splitwise-instance.cxfc1pmp6ndg.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "chakri9",
  ssl: true,
  database: "splitwise",
});

con.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Connected!");
  con.end();
});

//Allow Access Control

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", function (req, res) {
  console.log(req.body);
});

app.post("/login", function (req, res) {
  console.log(req.body);
});

app.listen(port, () => {
  console.log("Server connected to port 4000");
});

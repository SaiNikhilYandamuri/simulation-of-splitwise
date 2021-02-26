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
  password: "chakri96",
  ssl: true,
  database: "splitwise",
});

con.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Connected!");
  //con.end();
});

//Allow Access Control

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", function (req, res) {
  console.log(req.body);
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.passowrd;
  const insertUserQuery =
    "INSERT INTO user (email, fullname, password) VALUES ('" +
    email +
    "', '" +
    fullname +
    "', '" +
    password +
    "')";

  console.log(insertUserQuery);

  con.query(insertUserQuery, (err, result) => {
    if (err) throw err;
    console.log("Inserted");
  });
});

app.post("/login", function (req, res) {
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.passowrd;
  const selectLoginQuery =
    "Select * from user where email='" +
    email +
    "' and password='" +
    password +
    "'";
  console.log(selectLoginQuery);
  con.query(selectLoginQuery, (err, result) => {
    if (err) throw err;
    if (result) {
      res.writeHead(200);
      res.end("Successful Login");
    }
  });
});

app.listen(port, () => {
  console.log("Server connected to port 4000");
});

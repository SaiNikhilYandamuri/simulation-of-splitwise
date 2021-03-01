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
  const password = req.body.password;
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
    //console.log(err.code);
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log("User already present!!");
        res.status(409).json({ message: "User already exists!" });
      }
    } else {
      console.log("Inserted");
      res.status(200).json({ message: "Inserted" });
    }
  });
});

app.post("/login", function (req, res) {
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
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
      if (result.length) {
        res.writeHead(200);
        res.end("Successful Login");
      } else if (result.length === 0) {
        res.status(404).json({ message: "Invalid credentials!" });
      }

      console.log(result);
    }
  });
});

app.listen(port, () => {
  console.log("Server connected to port 4000");
});

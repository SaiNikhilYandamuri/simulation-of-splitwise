const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

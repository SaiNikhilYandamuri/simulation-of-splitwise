const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server connected to port 4000");
});

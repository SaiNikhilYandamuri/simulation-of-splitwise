const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import Routes
const signupRoute = require("./routes/Signup");
const loginRoute = require("./routes/Login");

dotenv.config();

console.log(process.env.DB_CONNECT);
// COnnect to DB
mongoose.connect(process.env.DB_CONNECT, { userNewUrlParser: true }, () =>
  console.log("Connected to DB")
);

// Middleware
app.use(express.json());

//Routes Middleware
app.use("/api/user", signupRoute);
app.use("/api/user", loginRoute);

app.listen(4000, () => console.log("Listening at port 4000"));

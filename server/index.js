const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Users = require("./model/Users");
const signupRoute = require("./routes/Signup");
const loginRoute = require("./routes/Login");
const createGroupRoute = require("./routes/GroupCreation");
const groupsDashboard = require("./routes/GroupsDashboard");
const groupHomePage = require("./routes/GroupHomePage");
const profilePage = require("./routes/UserProfile");
const dashboardPage = require("./routes/Dashboard");
const activityPage = require("./routes/RecentActivity");
const imageupload = require("./routes/imageupload");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.u3tzy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      poolSize: 10,
    },
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    app.listen(4000, () => {
      console.log("DB and Server connected");
    });
  });

// Middleware
app.use(express.json());

app.use("/api/user", signupRoute);
app.use("/api/user", loginRoute);
app.use("/api/user", createGroupRoute);
app.use("/api/user", groupsDashboard);
app.use("/api/user", groupHomePage);
app.use("/api/user", profilePage);
app.use("/api/user", dashboardPage);
app.use("/api/user", activityPage);
app.use("/api/user", imageupload);

/*
app.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  const user = new Users({
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const savedUser = await user.save();
    if (savedUser) {
      res.status(200).send({ fullname: user.fullname, email: user.email });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
*/
module.exports = app;

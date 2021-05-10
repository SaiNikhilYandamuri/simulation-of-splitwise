const router = require("express").Router();
const Group = require("../model/Groups");
const Users = require("../model/Users");
const jwt = require("jsonwebtoken");
const Activty = require("../model/Activity");
const { checkAuth } = require("../Utils/passport");
const mongoose = require("mongoose");
const secret = "hello";
var kafka = require("../kafka/client");

router.post("/creategroup", checkAuth, async (req, res) => {
  console.log("Inside Create Group");
  console.log(checkAuth);
  kafka.make_request("creategroup", req.body, function (err, results) {
    console.log("in result");
    console.log("results in messagepost ", results);
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "Error",
      });
      res.status(400).end();
    } else {
      console.log("Inside else", results);
      res.status(200).send("Succesfully saved.");
    }
  });
});

router.get("/users/:user_id", checkAuth, (req, res) => {
  Users.find({}, function (err, users) {
    const usersArray = [];
    users.forEach(function (user) {
      console.log(typeof user._id);
      // if (!user._id.equals(req.params.user_id))
      usersArray.push({ fullname: user.fullname, userId: user._id });
    });
    res.status(200).json({ users: usersArray });
  });
});

module.exports = router;

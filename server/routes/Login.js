const router = require("express").Router();
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { loginValidation } = require("../validation");
const Users = require("../model/Users");

// Validation

router.post("/login", async (req, res) => {
  //Let's validate the request
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if User already exists
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Enter Valid Credentials!");
  }

  // Check if the password exists
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Enter Valid Credentials!");
  }
  /*
  console.log(process.env.SECRET);
  const payload = { _id: user._id, fullname: user.fullname, email: user.email };
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: 30 * 60 * 1000,
  });*/

  res.status(200).end("JWT ");
});
module.exports = router;

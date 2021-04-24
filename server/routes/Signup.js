const router = require("express").Router();
const Users = require("../model/Users");
const bcrypt = require("bcrypt");
// const { signupValidation } = require("../validation");
const jwt = require("jsonwebtoken");
const { auth } = require("../Utils/passport");
const secret = "hello";
auth();

const saltRounds = 10;
// Validation

router.post("/signup", async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
  const user = new Users({
    fullname: req.body.fullname,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const emailExists = await Users.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).send("Email already exists");
    }
    const savedUser = await user.save();
    if (savedUser) {
      const payload = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      };
      // console.log(payload);
      const token = await jwt.sign(payload, secret, {
        expiresIn: 1000000,
      });
      // console.log(token);
      // res.status(200).end(token);
      res.status(200).json({ token: "jwt " + token });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
module.exports = router;

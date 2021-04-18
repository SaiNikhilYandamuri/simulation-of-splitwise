const router = require("express").Router();
const Users = require("../model/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { auth } = require("../Utils/passport");
const secret = "hello";
auth();
// Validation

router.post("/login", async (req, res) => {
  console.log("inside login");
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Enter Valid Credentials!");
    }
    const encryptedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!encryptedPassword) {
      console.log("Hello World");
      res.status(400).send("Enter Valid Credentials!");
    } else {
      const payload = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        currency: user.currency,
      };
      console.log(payload);
      const token = await jwt.sign(payload, secret, {
        expiresIn: 1000000,
      });
      console.log(token);
      //res.status(200).send(token);
      res.status(200).json({ token: "jwt " + token });
    }
  } catch (err) {
    return res.status(400).json({ message: "Enter Valid credentials" });
  }
});
module.exports = router;

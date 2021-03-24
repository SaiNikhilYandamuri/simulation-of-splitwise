const router = require("express").Router();
const Users = require("../model/Users");
const bcrypt = require("bcrypt");
const { signupValidation } = require("../validation");

// Validation

router.post("/signup", async (req, res) => {
  //Let's validate the request
  const { error } = signupValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if User already exists
  /*const emailExists = await Users.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send("Email already exists");
  }*/

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  console.log(hashPassword);

  // Create a new user
  const user = new Users({
    fullname: req.body.fullname,
    email: req.body.email,
    password: hashPassword,
  });

  console.log(user);

  try {
    // const savedUser = await user.save();

    user
      .save()
      .then((result) => {
        res.status(200).send({ fullname: user.fullname, email: user.email });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
    // console.log(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});
module.exports = router;

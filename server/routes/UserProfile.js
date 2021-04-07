const router = require("express").Router();
const Users = require("../model/Users");

router.get("/profile/:user_id", async function (req, res) {
  const user = await Users.findOne({ _id: req.params.user_id });
  if (!user) {
    return res.status(400).send("Enter Valid Credentials!");
  }
  res.status(200).json({
    email: user.email,
    fullname: user.fullname,
    phonenumber: user.phonenumber,
    currency: user.currency,
    timezone: user.timezone,
    language: user.language,
    image: user.photopath,
  });
});

module.exports = router;

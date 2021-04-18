const router = require("express").Router();
const Users = require("../model/Users");
const { checkAuth } = require("../Utils/passport");

router.get("/profile/:user_id", checkAuth, async function (req, res) {
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

router.post("/updateProfile", checkAuth, async function (req, res) {
  console.log("Inside Update Profile");
  console.log(req.body.userid);
  const user_id = req.body.userid;
  const emailUpdate = req.body.emailUpdate;
  const fullnameUpdate = req.body.fullnameUpdate;
  const phonenumberUpdate = req.body.phonenumberUpdate;
  const currencyUpdate = req.body.currencyUpdate;
  const languageUpdate = req.body.languageUpdate;
  const user = await Users.findOne({ _id: req.body.userid });
  if (!user) {
    console.log("Helo World");
    return res.status(400).send("Enter Valid Credentials!");
  }
  if (emailUpdate !== "") {
    user.email = emailUpdate;
  }
  if (fullnameUpdate !== "") {
    user.fullname = fullnameUpdate;
  }
  if (phonenumberUpdate !== "") {
    user.phonenumber = phonenumberUpdate;
  }
  if (currencyUpdate !== "") {
    user.currency = currencyUpdate;
  }
  if (languageUpdate !== "") {
    user.language = languageUpdate;
  }
  Users.findOneAndUpdate({ _id: user_id }, user, function (err, doc) {
    if (err) return res.send(500, { error: err });
    return res.status(200).send("Succesfully saved.");
  });
});

module.exports = router;

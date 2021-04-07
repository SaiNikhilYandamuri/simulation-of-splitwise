const router = require("express").Router();
const Users = require("../model/Users");
const Groups = require("../model/Groups");

// Tested using postman
router.get("/mygroups/:user_id", async function (req, res) {
  console.log(req.params.user_id);
  const user = await Users.findOne({ _id: req.params.user_id });
  if (!user) {
    return res.status(400).send("Enter Valid Credentials!");
  }
  console.log(user.group);

  const arrayOfGroup = user.group;
  const output = [];
  for (let i = 0; i < arrayOfGroup.length; i++) {
    const groupDetails = await Groups.findById(arrayOfGroup[i]);
    //Groups.findOne({_id: ele}, )
    console.log(groupDetails.groupName);
    output.push(groupDetails.groupName);
    console.log(output);
  }
  console.log(output);

  res.status(200).send(output);
});

// Tested with Postman
router.get("/invitegroups/:user_id", async function (req, res) {
  console.log(req.params.user_id);
  const user = await Users.findOne({ _id: req.params.user_id });
  if (!user) {
    return res.status(400).send("Enter Valid Credentials!");
  }
  console.log(user.group);

  const arrayOfGroup = user.groupInvitedTo;
  const output = [];
  for (let i = 0; i < arrayOfGroup.length; i++) {
    const groupDetails = await Groups.findOne({ _id: arrayOfGroup[i] });
    //Groups.findOne({_id: ele}, )
    console.log(groupDetails.groupName);
    output.push(groupDetails.groupName);
    console.log(output);
  }
  console.log(output);

  res.status(200).send(output);
});

// Tested it.
router.post("/acceptInvite", async function (req, res) {
  const user = await Users.findById(req.body.user_id);
  const groupDetails = await Groups.findOne({ groupName: req.body.groupName });
  if (!user) {
    return res.status(400).send("Invalid Credentials!");
  }
  const arrayOfInvitedGroup = user.groupInvitedTo;
  for (let i = 0; i < arrayOfInvitedGroup.length; i++) {
    console.log(arrayOfInvitedGroup[i]);
    console.log(groupDetails._id);
    const str1 = arrayOfInvitedGroup[i] + "";
    const str2 = groupDetails._id;
    const val = str1.localeCompare(str2);
    if (val === 0) {
      console.log("Inside");
      arrayOfInvitedGroup.splice(i, 1);
    }
  }
  const arrayOfGroup = user.group;
  arrayOfGroup.push(groupDetails._id);
  user.group = arrayOfGroup;
  Users.findOneAndUpdate({ _id: req.body.user_id }, user, function (err, doc) {
    console.log("Hello");
    if (err) return res.send(500, { error: err });
    return res.status(200).send("Succesfully saved.");
  });
});

module.exports = router;

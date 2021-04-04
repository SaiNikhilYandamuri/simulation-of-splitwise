const router = require("express").Router();
const Users = require("../model/Users");
const Groups = require("../model/Groups");

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

module.exports = router;

const router = require("express").Router();
const Groups = require("../model/Groups");
const Bills = require("../model/Bills");
const Users = require("../model/Users");

router.get("/getBillsOfGroup/:groupName", async function (req, res) {
  console.log(req.params.groupName);
  // const groupName = req.params.groupName;
  const groupDetails = await Groups.findOne({
    groupName: req.params.groupName,
  });
  const arrayOfBills = groupDetails.bills;
  const output = [];
  for (let i = 0; i < arrayOfBills.length; i++) {
    const billDetails = await Bills.findById(arrayOfBills[i]);
    const createdBy = await Users.findById(billDetails.createdBy);
    const bill = {
      descirption: billDetails.billDesc,
      total_amount: billDetails.billAmount,
      email: createdBy.fullName,
      timestamp: billDetails.billTimestamp,
    };
    output.pus(bill);
  }
  res.status(200).send(output);
});

router.get("/getMembersOfGroup:/:groupName", async function (req, res) {
  const groupDetails = await Groups.findOne({
    groupName: req.params.groupName,
  });
  const members = groupDetails.members;
  const output = [];
  for (let i = 0; i < members.length; i++) {
    const memberName = await Users.findById(members[i]);
  }
});

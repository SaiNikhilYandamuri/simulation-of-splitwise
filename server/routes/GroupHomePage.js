const router = require("express").Router();
const Groups = require("../model/Groups");
const Bills = require("../model/Bills");
const Users = require("../model/Users");

/* Tested using Postman*/
router.get("/getBillsOfGroup/:groupName", async function (req, res) {
  console.log(req.params.groupName);
  // const groupName = req.params.groupName;
  const groupDetails = await Groups.findOne({
    groupName: req.params.groupName,
  });
  const arrayOfBills = groupDetails.bills;
  const output = [];
  console.log(groupDetails);
  for (let i = 0; i < arrayOfBills.length; i++) {
    const billDetails = await Bills.findById(arrayOfBills[i]);
    // const createdBy = await Users.findById(billDetails.createdBy);
    const bill = {
      descirption: billDetails.billDesc,
      total_amount: billDetails.billAmount,
      email: billDetails.createdBy,
      timestamp: billDetails.billTimestamp,
    };
    console.log(bill);
    console.log(i);
    output.push(bill);
    if (i === arrayOfBills.length - 1) {
      res.status(200).send(output);
    }
  }
});

/*
Tested Using Postman
*/
router.get("/getMembersOfGroup/:groupName", async function (req, res) {
  const params = req.params.groupName.split("&");
  const groupDetails = await Groups.findOne({
    groupName: params[0],
  });
  console.log(groupDetails);
  const members = groupDetails.members;
  const output = [];
  for (let i = 0; i < members.length; i++) {
    const memberName = await Users.findById(members[i]);
    output.push(memberName.fullname);
  }
  res.status(200).send(output);
});

router.post("/leaveGroup", async function (req, res) {
  const groupDetails = await Groups.findOne({
    groupName: req.body.groupName,
  });
  const membersArray = groupDetails.members;
  for (let i = 0; i < membersArray.length; i++) {
    if (membersArray[i] + "" === req.body.user_id) {
      membersArray.splice(i, 1);
    }
  }
  groupDetails.members = membersArray;
  Groups.findOneAndUpdate(
    { groupName: req.body.groupName },
    groupDetails,
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      // return res.send('Succesfully saved.');
    }
  );
  const userDetails = await Users.findById(req.body.user_id);
  const groupArray = userDetails.group;
  for (let i = 0; i < groupArray.length; i++) {
    if (groupArray[i] === req.body.groupName) {
      groupArray.splice(i, 1);
    }
  }
  userDetails.group = groupArray;
  Users.findOneAndUpdate(
    { _id: req.body.user_id },
    userDetails,
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.status(200).send("Succesfully saved.");
    }
  );
});

/* Tested Using Postman */
router.post("/addBill", async function (req, res) {
  const userDetails = await Users.findById(req.body.userId);
  console.log(userDetails);
  const bill = new Bills({
    billAmount: req.body.amount,
    createdBy: userDetails.fullname,
    billDesc: req.body.description,
  });

  const saveBill = await bill.save();
  console.log(saveBill);
  if (saveBill) {
    const groupDetails = await Groups.findOne({
      groupName: req.body.group,
    });
    const arrayOfBills = groupDetails.bills;
    arrayOfBills.push(saveBill._id);
    groupDetails.bills = arrayOfBills;
    Groups.findOneAndUpdate(
      { _id: groupDetails._id },
      groupDetails,
      function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.status(200).send("Succesfully saved.");
      }
    );
    // res.status(200).end(saveBill);
  } else {
    res.status(500).end("Bill not added");
  }
});

module.exports = router;

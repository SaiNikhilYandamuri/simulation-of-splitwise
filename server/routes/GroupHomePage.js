const router = require("express").Router();
const mongoose = require("mongoose");
const Groups = require("../model/Groups");
const Bills = require("../model/Bills");
const Users = require("../model/Users");
const Transaction = require("../model/Transaction");
const Activty = require("../model/Activity");
const { checkAuth } = require("../Utils/passport");
var kafka = require("../kafka/client");

/* Tested using Postman*/
router.get("/getBillsOfGroup/:groupName", checkAuth, async function (req, res) {
  console.log(req.params.groupName);
  // const groupName = req.params.groupName;
  kafka.make_request("getbillsofgroup", req.params, function (err, results) {
    console.log("in result");
    console.log("results in messagepost ", results);
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "Error",
      });
      res.status(400).end();
    } else {
      console.log("Inside else", results);
      res.status(200).send(results);
    }
  });
});

/*
Tested Using Postman
*/
router.get(
  "/getMembersOfGroup/:groupName",
  checkAuth,
  async function (req, res) {
    const params = req.params.groupName.split("&");
    kafka.make_request("getmembersofgroup", params[0], function (err, results) {
      console.log("in result");
      console.log("results in messagepost ", results);
      if (err) {
        console.log("Inside err");
        res.json({
          status: "error",
          msg: "Error",
        });
        res.status(400).end();
      } else {
        console.log("Inside else", results);
        const output = results;
        res.status(200).send(output);
      }
    });
  }
);

router.post("/leaveGroup", checkAuth, async function (req, res) {
  const groupDetails = await Groups.findOne({
    groupName: req.body.groupName,
  });

  console.log("Inside Leave Group");

  const transactionOfGroup1 = await Transaction.find({
    group_id: groupDetails._id,
    sender: req.body.userId,
  });
  const transactionOfGroup2 = await Transaction.find({
    group_id: groupDetails._id,
    receiver: req.body.userId,
  });
  const transactionOfGroup12 = transactionOfGroup1.concat(transactionOfGroup2);
  const transactionOfGroup3 = await Transaction.find({
    group_id: mongoose.Types.ObjectId("00000000e332f843a87180a0"),
    receiver: req.body.userId,
  });
  const transactionOfGroup4 = await Transaction.find({
    group_id: mongoose.Types.ObjectId("00000000e332f843a87180a0"),
    sender: req.body.userId,
  });
  const transactionOfGroup34 = transactionOfGroup3.concat(transactionOfGroup4);
  const transactionOfGroup = transactionOfGroup12.concat(transactionOfGroup34);
  console.log(transactionOfGroup);
  const result = [];
  for (let i = 0; i < transactionOfGroup.length; i++) {
    const user_1 = await Users.findOne({ _id: transactionOfGroup[i].sender });
    const user_2 = await Users.findOne({
      _id: transactionOfGroup[i].receiver,
    });
    const eachTrans = {
      user_1: user_1.fullname,
      user_2: user_2.fullname,
      final_amount: transactionOfGroup[i].amount,
    };
    console.log(eachTrans);
    result.push(eachTrans);
  }
  const userDetails1 = await Users.findById(req.body.userId);
  const fullname = userDetails1.fullname;
  const friends = new Map();
  result.forEach((ele) => {
    // console.log(ele.user_1);
    // console.log(ele.user_2);
    if (ele.user_1 === fullname) {
      // console.log('inside 1');
      friends.set(ele.user_2, 0);
    } else {
      // console.log('inside 2');
      friends.set(ele.user_1, 0);
    }
  });
  result.forEach((ele) => {
    if (ele.user_1 === fullname) {
      const amount = friends.get(ele.user_2) + ele.final_amount;
      friends.set(ele.user_2, amount);
    } else {
      const amount = friends.get(ele.user_1) - ele.final_amount;
      friends.set(ele.user_1, amount);
    }
  });
  // eslint-disable-next-line no-restricted-syntax
  let flag = true;
  for (const [key, value] of friends.entries()) {
    console.log(value);
    if (value !== 0) {
      flag = false;
    }
  }

  // if (flag) {
  Groups.findOneAndUpdate(
    {
      _id: groupDetails._id,
    },
    {
      $pull: {
        members: req.body.userId,
      },
    },
    function (err, doc) {
      Users.findOneAndUpdate(
        {
          _id: req.body.userId,
        },
        {
          $pull: {
            group: groupDetails._id,
          },
        },
        async function (err, doc) {
          const membersOfGroup = groupDetails.members;
          const userInfo = await Users.findById(req.body.userId);
          for (let i = 0; i < membersOfGroup; i++) {
            const activity = new Activty({
              user_id: mongoose.Types.ObjectId(membersOfGroup[i]),
              message: userInfo.fullname + " has left the group " + groupName,
              group_id: groupDetails._id,
            });
            const saveActivity = await activity.save();
            console.log(saveActivity);
          }
          if (err) return res.send(500, { error: err });
          return res.status(200).send("Succesfully saved.");
        }
      );
    }
  );
  //} else {
  res.status(500).send("Unable to leave group");
  //}
});

/* Tested Using Postman */
router.post("/addBill", checkAuth, async function (req, res) {
  kafka.make_request("addbill1", req.body, function (err, results) {
    console.log("in result");
    console.log("results in messagepost ", results);
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "Error",
      });
      res.status(400).end();
    } else {
      console.log("Inside else", results);
      res.status(200).send("Succesfully saved.");
    }
  });
});

router.post("/addComment", checkAuth, async function (req, res) {
  kafka.make_request("addcomment", req.body, function (err, results) {
    console.log("in result");
    console.log("results in messagepost ", results);
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "Error",
      });
      res.status(400).end();
    } else {
      console.log("Inside else", results);
      res.status(200).send("Succesfully saved.");
    }
  });
});

router.get("/getComments/:billId", checkAuth, async function (req, res) {
  console.log(req.params.billId);
  kafka.make_request("getcommentsofbill", req.params, function (err, results) {
    console.log("in result");
    console.log("results in messagepost ", results);
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "Error",
      });
      res.status(400).end();
    } else {
      console.log("Inside else", results);
      res.status(200).send({ comments: results });
    }
  });
});

router.post("/deleteComment", checkAuth, async function (req, res) {
  const billId = req.body.billId;
  const commentId = req.body.commentId;

  const billDetails = await Bills.findById(billId);
  const comments = billDetails.comments;

  for (let i = 0; i < comments.length; i++) {
    const str1 = comments[i].comment_id + "";
    // const str2 = groupDetails._id;
    const val = str1.localeCompare(commentId);
    console.log(val);
    if (val === 0) {
      comments.splice(i, 1);
      // res.status(200).send("Succesfully saved.");
    }
  }
  billDetails.comments = comments;

  Bills.findOneAndUpdate({ _id: billId }, billDetails, function (err, doc) {
    if (err) return res.send(500, { error: err });
    console.log(doc);
    return res.status(200).send("Succesfully saved.");
  });
});

module.exports = router;

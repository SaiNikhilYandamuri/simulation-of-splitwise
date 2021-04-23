const router = require("express").Router();
const mongoose = require("mongoose");
const { checkAuth } = require("../Utils/passport");
const Transaction = require("../model/Transaction");
const Users = require("../model/Users");
const Activity = require("../model/Activity");

router.get("/dashboard/:userId", checkAuth, async (req, res) => {
  const userId = req.params.userId;
  const transactionDetails1 = await Transaction.find({
    sender: userId,
  });
  console.log(transactionDetails1);
  const transactionDetails2 = await Transaction.find({
    receiver: userId,
  });
  const transactionDetails = transactionDetails1.concat(transactionDetails2);
  const result = [];
  for (let i = 0; i < transactionDetails.length; i++) {
    const user_1 = await Users.findOne({ _id: transactionDetails[i].sender });
    const user_2 = await Users.findOne({ _id: transactionDetails[i].receiver });
    const eachTrans = {
      user_1: user_1.fullname,
      user_2: user_2.fullname,
      final_amount: transactionDetails[i].amount,
      user_i_id: transactionDetails[i].sender,
      user_2_id: transactionDetails[i].receiver,
    };
    console.log(eachTrans);
    result.push(eachTrans);
    if (i == transactionDetails.length - 1) {
      res.status(200);
      res.send(result);
    }
  }
});

router.post("/settleUp", checkAuth, async (req, res) => {
  const userId = req.body.userId;
  const friend = req.body.friendSelected;
  const friendDetails = await Users.findOne({
    fullname: friend,
  });
  let settleUpval = 0;
  if (req.body.settleUpValue > 0) {
    settleUpval = req.body.settleUpValue * -1;
  } else {
    settleUpval = req.body.settleUpValue * -1;
  }
  const friendId = friendDetails._id;
  const transaction = new Transaction({
    amount: settleUpval,
    sender: mongoose.Types.ObjectId(userId),
    receiver: mongoose.Types.ObjectId(friendId),
    group_id: mongoose.Types.ObjectId(0),
  });
  const saveTransaction = await transaction.save();
  console.log(saveTransaction);
  const userInfo = await Users.findById(userId);
  const activity = new Activity({
    user_id: mongoose.Types.ObjectId(friendDetails._id),
    message: userInfo.fullname + " has settleup with you.",
    group_id: mongoose.Types.ObjectId("00000000e332f843a87180a0"),
  });
  const saveActivity = await activity.save();
  console.log(saveActivity);
  return res.status(200).send("Succesfully saved.");
});

module.exports = router;

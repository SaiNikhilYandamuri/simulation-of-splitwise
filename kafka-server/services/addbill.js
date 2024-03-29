var mongo = require("./mongoose");
var mongoose = require("mongoose");

async function handle_request(msg, callback) {
  var res = {};

  {
    const userDetails = await mongo.Users.findById(msg.userId);
    const bill = new mongo.Bills({
      billAmount: msg.amount,
      createdBy: userDetails.fullname,
      billDesc: msg.description,
    });

    const saveBill = await bill.save();
    if (saveBill) {
      const groupDetails = await mongo.Groups.findOne({
        groupName: msg.group,
      });
      const arrayOfBills = groupDetails.bills;
      arrayOfBills.push(saveBill._id);
      groupDetails.bills = arrayOfBills;
      mongo.Groups.findOneAndUpdate(
        { _id: groupDetails._id },
        groupDetails,
        async function (err, doc) {
          if (err) return res.send(500, { error: err });
          const membersArray = groupDetails.members;
          membersArray.forEach(async (ele) => {
            const user1 = JSON.stringify(ele);
            const user2 = JSON.stringify(msg.userId);
            const cmp = user1.localeCompare(user2);
            const userName = userDetails.fullname;

            if (cmp !== 0) {
              const transaction = new mongo.Transaction({
                amount: msg.amount / membersArray.length,
                sender: mongoose.Types.ObjectId(msg.userId),
                receiver: mongoose.Types.ObjectId(ele),
                group_id: groupDetails._id,
              });
              const saveTransaction = await transaction.save();
              const activity = new mongo.Activity({
                user_id: mongoose.Types.ObjectId(ele),
                message:
                  userName +
                  " has created the Bill " +
                  bill.billDesc +
                  " of amount " +
                  bill.billAmount +
                  " in the group " +
                  msg.group,
                group_id: groupDetails.groupName,
              });
              const saveActivity = await activity.save();
            }
          });
          // return res.status(200).send("Succesfully saved.");
          callback(null, "Successfully Saved");
        }
      );
      // res.status(200).end(saveBill);
    } else {
      // res.status(500).end("Bill not added");
      console.log("Issue with adding a Bill");
      callback(null, "Problem with adding a bill");
    }

    //res.status(200).send(output);
    // callback(null, output);
  }
}

exports.handle_request = handle_request;

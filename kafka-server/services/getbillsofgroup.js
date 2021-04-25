var mongo = require("./mongoose");

async function handle_request(msg, callback) {
  var res = {};
  console.log("msg.type", msg);

  {
    console.log(msg.groupName);
    // const groupName = req.params.groupName;
    const groupDetails = await mongo.Groups.findOne({
      groupName: msg.groupName,
    });
    // console.log(groupDetails);
    const arrayOfBills = groupDetails.bills;
    const output = [];
    // console.log(groupDetails);
    for (let i = arrayOfBills.length - 1; i > -1; i--) {
      const billDetails = await mongo.Bills.findById(arrayOfBills[i]);
      // const createdBy = await Users.findById(billDetails.createdBy);
      const bill = {
        descirption: billDetails.billDesc,
        total_amount: billDetails.billAmount,
        email: billDetails.createdBy,
        timestamp: billDetails.billTimestamp,
        id: billDetails._id,
      };
      // console.log(bill);
      // console.log(i);
      output.push(bill);
      if (i === 0) {
        callback(null, output);
      }
    }
    //res.status(200).send(output);
    // callback(null, output);
  }
}

exports.handle_request = handle_request;

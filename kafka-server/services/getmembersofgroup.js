var mongo = require("./mongoose");

async function handle_request(msg, callback) {
  var res = {};
  console.log("msg.type", msg);

  {
    // const params = msg.groupName.split("&");
    const groupDetails = await mongo.Groups.findOne({
      groupName: msg,
    });

    console.log(groupDetails);
    const members = groupDetails.members;
    const output = [];
    for (let i = 0; i < members.length; i++) {
      const memberName = await mongo.Users.findById(members[i]);
      output.push(memberName.fullname);
    }
    //res.status(200).send(output);

    //res.status(200).send(output);
    callback(null, output);
  }
}

exports.handle_request = handle_request;

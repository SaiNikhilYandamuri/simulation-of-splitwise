var mongo = require("./mongoose");

async function handle_request(msg, callback) {
  var res = {};
  console.log("msg.type", msg);

  {
    console.log(msg.user_id);
    const user = await mongo.Users.findOne({ _id: msg.user_id });
    if (!user) {
      return res.status(400).send("Enter Valid Credentials!");
    }
    console.log(user.group);

    const arrayOfGroup = user.group;
    const output = [];
    for (let i = 0; i < arrayOfGroup.length; i++) {
      console.log("Hello inside mygroups");
      const groupDetails = await mongo.Groups.findById(arrayOfGroup[i]);
      //Groups.findOne({_id: ele}, )
      //if (groupDetails.groupName === null) {
      console.log(groupDetails.groupName);
      output.push(groupDetails.groupName);
      console.log(output);
      //}
    }
    console.log(output);

    //res.status(200).send(output);
    callback(null, output);
  }
}

exports.handle_request = handle_request;

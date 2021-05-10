var mongo = require("./mongoose");
var mongoose = require("mongoose");

async function handle_request(msg, callback) {
  var res = {};

  const groupName = msg.groupName;
  const form = msg.value;
  const email = msg.email;
  const userone = await mongo.Users.findOne({ email: email });
  const membersArray = [];

  membersArray.push(userone._id);
  console.log(membersArray);
  const newGroup = new mongo.Groups({
    groupName: msg.groupName,
    members: membersArray,
  });

  mongo.Groups.findOne({ groupName: msg.groupName }, (error, group) => {
    if (error) callback(null, error);
    if (group) {
      if (error) callback(null, error);
    } else {
      newGroup.save(async (error, data) => {
        if (error) {
          if (error) callback(null, error);
        } else {
          console.log(data._id);
          const userone = await mongo.Users.findOne({ email: email });
          mongo.Users.findOneAndUpdate(
            { _id: userone._id },
            {
              $push: {
                group: data._id,
              },
            },
            async function (err, doc) {
              console.log("Hello1234");
              if (err) callback(null, err);
              // return res.status(200).send("Succesfully saved.");
              for (let i = 0; i < form.length; i++) {
                console.log("yasdhasdh");
                console.log(form[i].value);
                const user = await mongo.Users.findById(form[i].value);
                console.log(user);
                // console.log(user.groupInivtedTo);
                const activity = new mongo.Activity({
                  user_id: mongoose.Types.ObjectId(form[i].value),
                  message:
                    userone.fullname +
                    " has invited you to join the group " +
                    groupName,
                  group_id: data.groupName,
                });
                const saveActivity = await activity.save();
                console.log(saveActivity);
                mongo.Users.findOneAndUpdate(
                  { _id: user._id },
                  {
                    $push: {
                      groupInvitedTo: data._id,
                    },
                  },
                  function (err, doc) {
                    console.log("Hello6789");
                    if (err) callback(null, err);
                    // return res.status(200).send("Succesfully saved.");
                  }
                );
                if (i === form.length - 1) {
                  callback(null, "Succesfully saved.");
                  // return res.status(200).send("Succesfully saved.");
                }
              }
            }
          );
        }
      });
    }
  });
}

exports.handle_request = handle_request;

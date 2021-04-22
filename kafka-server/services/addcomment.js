var mongo = require("./mongoose");
var mongoose = require("mongoose");

async function handle_request(msg, callback) {
  var res = {};
  //console.log("In handle request: for allmsgs get" + JSON.stringify(msg));
  // console.log("msg.type", msg);

  {
    // console.log(msg.user_id);
    const billId = msg.billId;
    const userId = msg.userId;
    const id = mongoose.Types.ObjectId();
    const comment = {
      comment_id: id,
      comment: msg.comment,
      user_id: userId,
    };
    mongo.Bills.findOneAndUpdate(
      { _id: billId },
      {
        $push: {
          comments: comment,
        },
      },
      function (err, doc) {
        if (err) callback(null, "Problem with adding a comment");
        // return res.send(500, { error: err });
        // return res.status(200).send("Succesfully saved.");
        callback(null, "Successfully Saved");
      }
    );

    //res.status(200).send(output);
    // callback(null, output);
  }
}

exports.handle_request = handle_request;

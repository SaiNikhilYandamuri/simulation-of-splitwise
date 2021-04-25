var mongo = require("./mongoose");
var mongoose = require("mongoose");

async function handle_request(msg, callback) {
  var res = {};

  {
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
        callback(null, "Successfully Saved");
      }
    );
  }
}

exports.handle_request = handle_request;

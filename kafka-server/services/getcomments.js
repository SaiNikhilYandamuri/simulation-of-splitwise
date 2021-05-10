var mongo = require("./mongoose");

async function handle_request(msg, callback) {
  var res = {};
  console.log("msg.type", msg);

  {
    const billDetails = await mongo.Bills.findById(msg.billId);
    const commentsArray = billDetails.comments;
    const commentsFinal = [];
    if (commentsArray.length > 0) {
      for (let i = 0; i < commentsArray.length; i++) {
        const userDetails = await mongo.Users.findById(
          commentsArray[i].user_id
        );
        const comment = {
          comment: commentsArray[i].comment,
          user: userDetails.fullname,
          id: userDetails._id,
          commentId: commentsArray[i].comment_id,
        };
        commentsFinal.push(comment);
        if (i === commentsArray.length - 1) {
          // res.status(200).send({ comments: commentsFinal });
          callback(null, commentsFinal);
        }
      }
    } else {
      // res.status(200).send({ comments: commentsFinal });
      callback(null, commentsFinal);
    }

    //res.status(200).send(output);
    // callback(null, output);
  }
}

exports.handle_request = handle_request;

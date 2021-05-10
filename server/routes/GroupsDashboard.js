const router = require("express").Router();
const Users = require("../model/Users");
const Groups = require("../model/Groups");
const Activity = require("../model/Activity");
const { checkAuth } = require("../Utils/passport");
var kafka = require("../kafka/client");
const mongoose = require("mongoose");

// Tested using postman
router.get("/mygroups/:user_id", checkAuth, async function (req, res) {
  console.log("Inside My groups");
  kafka.make_request("mygroups1", req.params, function (err, results) {
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

// Tested with Postman
router.get("/invitegroups/:user_id", checkAuth, async function (req, res) {
  console.log(req.params.user_id);
  kafka.make_request("invitegroups", req.params, function (err, results) {
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

// Tested it.
router.post("/acceptInvite", checkAuth, async function (req, res) {
  console.log("/acceptInvite");
  const groupDetails = await Groups.findOne({ groupName: req.body.groupName });
  Users.findOneAndUpdate(
    { _id: req.body.userid },
    {
      $push: {
        group: groupDetails._id,
      },
    },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      Users.findOneAndUpdate(
        { _id: req.body.userid },
        {
          $pull: {
            groupInvitedTo: groupDetails._id,
          },
        },
        function (err, doc) {
          if (err) return res.send(500, { error: err });
          Groups.findOneAndUpdate(
            {
              _id: groupDetails._id,
            },
            {
              $push: {
                members: mongoose.Types.ObjectId(req.body.userid),
              },
            },
            async function (err, doc) {
              if (err) return res.send(500, { error: err });
              const membersOfGroup = groupDetails.members;
              const userone = await Users.findById(req.body.userid);
              for (let i = 0; i < membersOfGroup.length; i++) {
                const activity = new Activity({
                  user_id: mongoose.Types.ObjectId(membersOfGroup[i]),
                  message:
                    userone.fullname +
                    " has accepted invite to the group " +
                    req.body.groupName,
                  group_id: req.body.groupName,
                });
                const saveActivity = await activity.save();
                console.log(saveActivity);
              }

              return res.status(200).send("Succesfully saved.");
            }
          );
          // return res.status(200).send("Succesfully saved.");
        }
      );
    }
  );
});

module.exports = router;

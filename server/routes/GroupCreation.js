const router = require("express").Router();
const Group = require("../model/Groups");
const Users = require("../model/Users");
const jwt = require("jsonwebtoken");
const { checkAuth } = require("../Utils/passport");
const mongoose = require("mongoose");
const secret = "hello";

router.post("/creategroup", checkAuth, async (req, res) => {
  console.log("Inside Create Group");
  console.log(checkAuth);
  const groupName = req.body.groupName;
  const form = req.body.value;
  const email = req.body.email;
  const userone = await Users.findOne({ email: email });
  const membersArray = [];
  /* for (let i = 0; i < form.length; i++) {
    membersArray.push(mongoose.Types.ObjectId(form[i].value));
  } */
  membersArray.push(userone._id);
  console.log(membersArray);
  const newGroup = new Group({
    groupName: req.body.groupName,
    members: membersArray,
  });
  console.log(req.body);

  Group.findOne({ groupName: req.body.groupName }, (error, group) => {
    if (error) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (group) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Group with the name already exists");
    } else {
      newGroup.save(async (error, data) => {
        if (error) {
          res.writeHead(500, {
            "Content-Type": "text/plain",
          });
          res.end();
        } else {
          console.log(data._id);
          const userone = await Users.findOne({ email: email });
          Users.findOneAndUpdate(
            { _id: userone._id },
            {
              $push: {
                group: data._id,
              },
            },
            async function (err, doc) {
              console.log("Hello1234");
              if (err) return res.send(500, { error: err });
              // return res.status(200).send("Succesfully saved.");
              for (let i = 0; i < form.length; i++) {
                console.log("yasdhasdh");
                console.log(form[i].value);
                const user = await Users.findById(form[i].value);
                console.log(user);
                // console.log(user.groupInivtedTo);
                Users.findOneAndUpdate(
                  { _id: user._id },
                  {
                    $push: {
                      groupInvitedTo: data._id,
                    },
                  },
                  function (err, doc) {
                    console.log("Hello6789");
                    if (err) return res.send(500, { error: err });
                    // return res.status(200).send("Succesfully saved.");
                  }
                );
                if (i === form.length - 1) {
                  return res.status(200).send("Succesfully saved.");
                }
              }
            }
          );
        }
      });
    }
  });
});

router.get("/users/:user_id", checkAuth, (req, res) => {
  Users.find({}, function (err, users) {
    const usersArray = [];
    users.forEach(function (user) {
      console.log(typeof user._id);
      // if (!user._id.equals(req.params.user_id))
      usersArray.push({ fullname: user.fullname, userId: user._id });
    });
    res.status(200).json({ users: usersArray });
  });
});

module.exports = router;

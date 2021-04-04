const router = require("express").Router();
const Group = require("../model/Groups");
const jwt = require("jsonwebtoken");
const { checkAuth } = require("../Utils/passport");
const secret = "hello";

router.post("/creategroup", (req, res) => {
  console.log("Inside Create Group");
  console.log(checkAuth);
  const newGroup = new Group({
    groupName: req.body.groupName,
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
      newGroup.save((error, data) => {
        if (error) {
          res.writeHead(500, {
            "Content-Type": "text/plain",
          });
          res.end();
        } else {
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end();
        }
      });
    }
  });
});

module.exports = router;

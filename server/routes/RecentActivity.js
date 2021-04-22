const router = require("express").Router();
const { checkAuth } = require("../Utils/passport");
const Activity = require("../model/Activity");

router.get("/recentActivity/:userId", checkAuth, async (req, res) => {
  console.log("Inside Recent Activity");
  const activities = await Activity.find({ user_id: req.params.userId });
  const finalAcivity = [];
  for (let i = 0; i < activities.length; i++) {
    finalAcivity.push({
      message: activities[i].message,
      time: activities[i].timestamp,
      groupname: activities[i].groupname,
    });
    if (i === activities.length - 1) {
      console.log("Final");
      res.status(200);
      res.send(finalAcivity);
    }
  }
});

module.exports = router;

const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  group_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Activity", activitySchema);

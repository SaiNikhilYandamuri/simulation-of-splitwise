const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  groupName: {
    type: String,
    required: true,
    max: 255,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  photopath: {
    type: String,
    default: "default.jpg",
  },
  bills: {
    type: Array,
    default: [],
  },
  members: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Group", groupSchema);

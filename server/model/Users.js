const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  email: {
    type: String,
    required: true,
    max: 255,
  },
  fullname: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  phonenumber: {
    type: Number,
    required: false,
    default: null,
    min: 10,
    max: 10,
  },
  currency: {
    type: String,
    required: false,
    default: "USD",
    min: 3,
    max: 3,
  },
  timezone: {
    type: Date,
    default: Date.now,
  },
  language: {
    type: String,
    default: "English",
    max: 50,
  },
  photopath: {
    type: String,
    default: "default.jpg",
  },
  group: {
    type: Array,
    default: [],
  },
  groupInvitedTo: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User", usersSchema);

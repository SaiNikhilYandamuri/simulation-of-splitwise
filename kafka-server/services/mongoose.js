var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.u3tzy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      poolSize: 10,
    }
  )
  .then(
    () => {
      console.log("Mongoose is Connected");
    },
    (err) => {
      console.log("Mongoose is Not Connected" + err);
    }
  );
// Or using promises

module.exports.Users = mongoose.model("User", {
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

module.exports.Groups = mongoose.model("Group", {
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

module.exports.Bills = mongoose.model("Bill", {
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  billAmount: {
    type: Number,
    required: true,
  },
  billTimestamp: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
  billDesc: {
    type: String,
    required: true,
  },
  transactionId: {
    type: Array,
    default: [],
  },
  comments: {
    type: Array,
    default: [],
  },
});

module.exports.Transaction = mongoose.model("Transaction", {
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  sender: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  group_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports.Activity = mongoose.model("Activity", {
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

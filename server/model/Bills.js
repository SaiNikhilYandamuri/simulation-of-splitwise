const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
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
    defualt: Date.now,
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
});

module.exports = mongoose.model("Bill", billSchema);

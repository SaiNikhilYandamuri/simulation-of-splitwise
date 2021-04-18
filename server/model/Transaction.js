const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Transaction", transactionSchema);

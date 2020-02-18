let mongoose = require("mongoose");

const User = mongoose.Schema({
  cid: String,
  pmid: String,
  name: String,
  email: String,
  password: String,
  mobile: Number,
  credit: Number
});

const Subscription = mongoose.Schema({
  id: String,
  status: String,
  planId: String,
  planName: String,
});

module.exports.User = mongoose.model("User", User);
module.exports.Subscription = mongoose.model("Subscription", Subscription);
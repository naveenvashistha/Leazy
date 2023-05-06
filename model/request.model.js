const mongoose  = require("mongoose");

const requestSchema = new mongoose.Schema({
  email:String,
  movie: String
});

const Request = mongoose.model("Request",requestSchema);

module.exports = Request;

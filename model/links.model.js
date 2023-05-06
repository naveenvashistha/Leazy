const mongoose  = require("mongoose");

const linksSchema = new mongoose.Schema({
  name:String,
  link: String
});

const Link = mongoose.model("Link",linksSchema);

module.exports = Link;

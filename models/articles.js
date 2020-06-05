var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
  headline: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  img: {
    type: String,
  },
  notes: { type: Array, default: [] },
  saved: {
    type: Boolean,
    default: false,
  },
});

var Article = mongoose.model("articles", ArticlesSchema);

module.exports = Article;

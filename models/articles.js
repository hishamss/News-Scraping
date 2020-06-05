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
});

var Article = mongoose.model("articles", ArticlesSchema);

module.exports = Article;

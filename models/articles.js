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
  saved: {
    type: Boolean,
    default: false,
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notes",
    },
  ],
});

var Article = mongoose.model("articles", ArticlesSchema);

module.exports = Article;

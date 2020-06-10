var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotesSchema = new Schema({
  text: {
    type: String,
  },
  articleId: {
    type: String,
  },
});

var Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;

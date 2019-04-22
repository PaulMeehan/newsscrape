const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  category: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: false
  },
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  noteFK: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

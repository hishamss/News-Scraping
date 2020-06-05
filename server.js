var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var mongoose = require("mongoose");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// axios.get("https://www.reuters.com/politics").then((response) => {
// https://www.washingtonpost.com/politics/?nid=top_nav_politics
var Article = require("./models/articles");
mongoose.connect("mongodb://localhost/articlesdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
app.get("/", (req, res) => {
  axios
    .get("https://www.washingtonpost.com/politics/?nid=top_nav_politics")
    .then((response) => {
      var $ = cheerio.load(response.data);
      var results = [];
      $("div.story-list-story").each((i, element) => {
        var headline = $(element)
          .find(".story-body")
          .children(".story-headline")
          .find("h2")
          .children("a")
          .text();
        var link = $(element)
          .find(".story-body")
          .children(".story-headline")
          .find("h2")
          .children("a")
          .attr("href");
        var description = $(element)
          .find(".story-body")
          .children(".story-description")
          .children("p")
          .text();
        var img = $(element)
          .find(".story-image")
          .children("a")
          .children("img")
          .attr("src");
        if (
          headline !== "" &&
          description !== "" &&
          link !== "" &&
          img !== ""
        ) {
          var story = {
            headline: headline,
            link: link,
            description: description,
            img: img,
          };
          results.push(story);
        }
      });
      var oldNumber, newNumber;
      Article.countDocuments({}, (err, count) => {
        oldNumber = count;
        Article.create(results)
          .then(() => {
            Article.countDocuments({}, (err, count) => {
              newNumber = count;
              res.send(`${newNumber - oldNumber} articles added!`);
            });
          })
          .catch(() => {
            Article.countDocuments({}, (err, count) => {
              newNumber = count;
              res.send(`${newNumber - oldNumber} articles have been added`);
            });
          });
      });
    });
});

app.listen(3000, function () {
  console.log("App running on port 3000!");
});

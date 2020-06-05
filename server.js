var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// axios.get("https://www.reuters.com/politics").then((response) => {
app.get("/", (req, res) => {
  axios
    .get("https://www.washingtonpost.com/politics/?nid=top_nav_politics")
    .then((response) => {
      var $ = cheerio.load(response.data);

      var results = [];
      $("div.story-list-story").each((i, element) => {
        //     console.log($(element).find("story-title").text());
        //   });
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
            image: img,
          };
          results.push(story);
        }
      });
      res.send(results);
    });
});

app.listen(3000, function () {
  console.log("App running on port 3000!");
});

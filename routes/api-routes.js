var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
var Article = require("../models/articles");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articlesdb";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
module.exports = (app) => {
  app.get("/scrape", (req, res) => {
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
                res.send(`${newNumber - oldNumber} articles added`);
              });
            });
        });
      });
  });
  app.get("/all", (req, res) => {
    var query = Article.find({ saved: false }).select(
      "headline link description img"
    );
    query.exec((err, found) => {
      if (err) throw err;
      res.send(found);
    });
  });

  app.get("/getSaved", (req, res) => {
    var query = Article.find({ saved: true }).select(
      "headline link description img"
    );
    query.exec((err, found) => {
      if (err) throw err;
      res.send(found);
    });
  });

  app.get("/clear", (req, res) => {
    Article.deleteMany({ saved: false }, () => {
      res.render("home");
    });
  });
  app.put("/saved/:id", (req, res) => {
    Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.send("updated");
      }
    });
  });

  app.delete("/deleteArticle/:id", (req, res) => {
    Article.deleteOne({ _id: req.params.id }, (err, result) => {
      if (err) {
        res.send(false);
      } else {
        res.send(true);
      }
    });
  });

  app.get("/clearSaved", (req, res) => {
    Article.deleteMany({ saved: true }, () => {
      console.log("saved deleted");
      res.render("saved");
    });
  });

  app.post("/addNote/:id", (req, res) => {
    Article.updateOne(
      { _id: req.params.id },
      { $push: { notes: [req.body.note] } },
      (err, result) => {
        if (err) {
          res.send(false);
        } else {
          res.send("Added!");
        }
      }
    );
  });

  app.get("/getNotes/:id", (req, res) => {
    var query = Article.find({ _id: req.params.id }).select("notes -_id");
    query.exec((err, found) => {
      if (err) throw err;
      res.send(found);
    });
  });
};

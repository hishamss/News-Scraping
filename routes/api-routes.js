var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
// Require all models
var db = require("../models");
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
        db.Article.countDocuments({}, (err, count) => {
          oldNumber = count;
          db.Article.create(results)
            .then(() => {
              db.Article.countDocuments({}, (err, count) => {
                newNumber = count;
                res.send(`${newNumber - oldNumber} articles added!`);
              });
            })
            .catch(() => {
              db.Article.countDocuments({}, (err, count) => {
                newNumber = count;
                res.send(`${newNumber - oldNumber} articles added`);
              });
            });
        });
      });
  });
  app.get("/all", (req, res) => {
    var query = db.Article.find({ saved: false }).select(
      "headline link description img"
    );
    query.exec((err, found) => {
      if (err) throw err;
      res.send(found);
    });
  });

  app.get("/getSaved", (req, res) => {
    var query = db.Article.find({ saved: true }).select(
      "headline link description img"
    );
    query.exec((err, found) => {
      if (err) throw err;
      res.send(found);
    });
  });

  app.get("/clear", (req, res) => {
    db.Article.deleteMany({ saved: false }, () => {
      res.render("home");
    });
  });
  app.put("/saved/:id", (req, res) => {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { saved: true },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send("updated");
        }
      }
    );
  });

  app.delete("/deleteArticle/:id", (req, res) => {
    db.Article.deleteOne({ _id: req.params.id })
      .then(() => {
        return db.Note.deleteMany({ articleId: req.params.id });
      })
      .then(() => {
        res.send(true);
      })
      .catch(() => {
        res.send(false);
      });
  });

  app.delete("/deleteNote/:id", (req, res) => {
    var articleId = req.params.id.split(",")[0];
    var noteIndex = req.params.id.split(",")[1];
    // MongoDB does not accept concatination inside the query so the workaround is to define update as variable then pass it to the syntax
    db.Note.deleteOne({ _id: noteIndex })
      .then((found) => {
        return db.Article.updateOne(
          { _id: articleId },
          { $pullAll: { notes: [noteIndex] } }
        );
      })
      .then((dbArticle) => {
        res.send(true);
      })
      .catch(() => {
        res.send(false);
      });
  });

  app.get("/clearSaved", (req, res) => {
    db.Article.deleteMany({ saved: true })
      .then(() => {
        return db.Note.deleteMany({});
      })
      .then(() => {
        res.render("saved");
      })
      .catch((err) => {
        res.status(500).end();
      });
  });

  app.post("/addNote/:id", (req, res) => {
    // db.Article.updateOne(
    //   { _id: req.params.id },
    //   { $push: { notes: [req.body.note] } },
    //   (err, result) => {
    //     if (err) {
    //       res.send(false);
    //     } else {
    //       res.send("Added!");
    //     }
    //   }
    // );

    db.Note.create(req.body)
      .then((dbNote) => {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { notes: dbNote._id } },
          { new: true }
        );
      })
      .then((dbArticle) => {
        res.send("Added!");
      })
      .catch((err) => {
        res.send(false);
      });
  });

  app.get("/getNotes/:id", (req, res) => {
    var query = db.Article.findOne({ _id: req.params.id }).select("notes -_id");
    // query.exec((err, found) => {
    //   if (err) throw err;
    //   res.send(found);
    // });
    query
      .populate("notes")
      .then((found) => {
        res.json(found);
      })
      .catch((err) => {
        res.status(500).end();
      });
  });
};

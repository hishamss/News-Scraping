module.exports = (app) => {
  app.get("/", (req, res) => {
    res.render("home");
  });
  app.get("/saved", (req, res) => {
    res.render("saved");
  });
};

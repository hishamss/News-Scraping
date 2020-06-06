var express = require("express");

var exphbs = require("express-handlebars");
var PORT = process.env.PORT || 3000;
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/html-routes")(app);
require("./routes/api-routes")(app);

app.listen(PORT, function () {
  console.log("App running on port 3000!");
});

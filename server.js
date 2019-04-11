const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

const routes = require("./controllers/newsControllers.js")

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
})
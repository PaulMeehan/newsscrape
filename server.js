const express = require("express");
const app = express();

const mongoose = require("mongoose");
const db = require("./models");

const axios = require("axios");
const cheerio = require("cheerio");

const PORT = process.env.PORT || 8080;

app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/newsscrape", { useNewUrlParser: true });

// const routes = require("./controllers/newsControllers.js")

// app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});

app.get("/scrape", (req, res) => {
  axios.get("http://www.mentalfloss.com/").then(response => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("div.eyebrow").each((i, element) => {
      // Save an empty result object
      const result = {};
      // Add the text and href of every link, and save them as properties of the result object
      debugger;
      result.section = $(element).text();
      result.title = $(element).next(".headline").text();
      result.link = $(element).parent("a").attr("href");
      debugger;

      // Create a new Article using the `result` object built from scraping
      // db.Article.create(result)
      //   .then(dbArticle => {
      //     // View the added result in the console
      //     console.log(dbArticle);
      //   })
      //   .catch(err => {
      //     // If an error occurred, log it
      //     console.log(err);
      //   });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});



// module.exports = db;

// app.get("/", (req, res) => {
//   console.log("one");
//   console.log(db);
//   debugger;
//   db.articles.find({}), (err, results) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("here");
//       res.json(results);
//     };
//   };
// });

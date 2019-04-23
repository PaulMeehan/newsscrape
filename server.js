const express = require("express");
const app = express();

const mongoose = require("mongoose");
const db = require("./models");

const axios = require("axios");
const cheerio = require("cheerio");

const PORT = process.env.PORT || 8080;

// app.use(express.static("./public/assets"));
const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");
// const routes = require("./controllers/newsControllers.js")
// app.use(routes);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscrape";

// mongoose.connect("mongodb://localhost/newsscrape", { useNewUrlParser: true });
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });



app.get("/scrape", (req, res) => {
  console.log("in scrapeArticles");

  axios.get("http://www.mentalfloss.com/").then(response => {
    const $ = cheerio.load(response.data);
    var urlFragment = "";
    var ctr1 = 0;
    var ctr2 = 0;

    $("div.eyebrow").each((i, element) => {
      console.log(i);
      // Save an empty result object
      const newArticle = {};
      // Add the text and href of every link, and save them as properties of the result object
      newArticle.category = $(element).text();
      newArticle.title = $(element).next(".headline").text();
      urlFragment = $(element).parent("a").attr("href");
      newArticle.url = "http://www.mentalfloss.com" + urlFragment;
      ctr1 = ctr1 + 1;

      db.Article.create(newArticle)
        .then(dbArticle => {
          ctr2 = ctr2 + 1;
          console.log(ctr2);
        })
        .catch(err => {
          console.log(err);
        });

      if (ctr1 === ctr2) {
        console.log("done");
      };

    });

    // alert("New articles scraped");
    console.log("new articles scraped");
    // $("#messages").attr("hidden", true);
    res.redirect("/all");
    // window.location = "/all"

  });
  console.log("down here");

});



app.get("/all", (req, res) => {
  console.log("one");
  db.Article.find({})
    .then(results => {
      const hbsObject = {
        article: results
      };
      res.render("index", hbsObject);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/clearall", (req, res) => {
  console.log("clearall");
  db.Article.deleteMany({})
    .then(results => {
      res.render("index");
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/article/:id", (req, res) => {
  console.log("update");
  const thisId = req.params.id;
  console.log(thisId);
  db.Article.findOneAndUpdate({ _id: thisId }, { saved : true }, { new: false })
    .then(results => {
      console.log("past");
      // res.render("index");
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/", (req, res) => {
  db.Article.deleteMany({})
    .then( results => {
      res.render("index");
    })
    .catch(err => {
      console.log(err);
    });
});
  
app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});


module.exports = app;

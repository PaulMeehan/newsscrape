const express = require("express");
const app = express();

const mongoose = require("mongoose");
const db = require("./models");

const axios = require("axios");
const cheerio = require("cheerio");

const PORT = process.env.PORT || 8080;

const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscrape";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", (req, res) => {

  axios.get("http://www.mentalfloss.com/").then(response => {
    const $ = cheerio.load(response.data);
    var urlFragment = "";
    var ctr1 = 0;
    var ctr2 = 0;

    $("div.eyebrow").each((i, element) => {
      // Save an empty result object
      const newArticle = {};
      // Add the text and href of every link, and save them as properties of the result object
      newArticle.category = $(element).text();
      newArticle.title = $(element).next(".headline").text();
      urlFragment = $(element).parent("a").attr("href");
      newArticle.url = "http://www.mentalfloss.com" + urlFragment;
      ctr1 = ctr1 + 1;
      console.log("ctr1=" + ctr1);

      db.Article.create(newArticle)
        .then(dbArticle => {
          ctr2 = ctr2 + 1;
          console.log("ctr2=" + ctr2);
        })
        .catch(err => {
          console.log(err);
        });

    });

    console.log("new articles scraped");
    res.redirect("/all");

  });

});


app.get("/all", (req, res) => {
  db.Article.find({ saved: false})
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

app.get("/saved", (req, res) => {
  db.Article.find({ saved: true })
    .then(results => {
      const hbsObject = {
        article: results
      };
      res.render("saved", hbsObject);
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

app.get("/article/save/:id", (req, res) => {
  const thisId = req.params.id;
  db.Article.findOneAndUpdate({ _id: thisId }, { saved : true }, { new: false })
    .then(results => {
      console.log("saved");
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/article/unsave/:id", (req, res) => {
  const thisId = req.params.id;
  db.Article.findOneAndUpdate({ _id: thisId }, { saved: false }, { new: false })
    .then(results => {
      console.log("unsaved");
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

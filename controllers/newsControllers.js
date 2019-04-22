const express = require("express");
const router = express.Router();

const server = require("../server");


app.get("/scrape", (req, res) => {
  axios.get("http://www.mentalfloss.com/").then(response => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    var urlFragment = "";

    // Now, we grab every h2 within an article tag, and do the following:
    $("div.eyebrow").each((i, element) => {
      // Save an empty result object
      const result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.category = $(element).text();
      result.title = $(element).next(".headline").text();
      urlFragment = $(element).parent("a").attr("href");

      result.url = "http://www.mentalfloss.com" + urlFragment;

      db.Article.create(result)
        .then(dbArticle => {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(err => {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// router.get("/", function(req, res) {
//   News.all(function(data) {
//     const hbsObject = {
//       news: data
//     };
//     console.log(hbsObject);
//     res.render("index", hbsObject);
//   });
// });

// Export routes for index.js to use.
module.exports = router;

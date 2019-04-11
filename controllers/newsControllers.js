const express = require("express");

const router = express.Router();

const news = require("../models/news.js");

router.get("/", function(req, res) {
  news.all(function(data) {
    const hbsObject = {
      news: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

// Export routes for index.js to use.
module.exports = router;

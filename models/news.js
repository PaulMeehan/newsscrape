
const news = {
  all: function(cb) {
    var res = {
      article1: 
      {
        "headline": "top story 1",
        "summary": "summary 1",
        "url": "bignews.com/topstory1"
      },
      article2: 
      {
        "headline": "top story 2",
        "summary": "summary 2",
        "url": "bignews.com/topstory2"
      },
      article3: 
      {
        "headline": "top story 3",
        "summary": "summary 3",
        "url": "bignews.com/topstory3"
      }
    };

    cb(res);
  }
};

module.exports = news;

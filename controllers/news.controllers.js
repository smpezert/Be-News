const { selectTopics } = require("../models/news.models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topic) => {
      // console.log(res);
      res.status(200).send({ topics: topic });
    })
    .catch((error) => {
      next(error);
    });
};

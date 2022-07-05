const {
  selectTopics,
  selectArticleById,
  selectUsers,
} = require("../models/news.models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topic) => {
      res.status(200).send({ topics: topic });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((user) => {
      res.status(200).send({ users: user });
    })
    .catch((error) => {
      next(error);
    });
};

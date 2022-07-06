const {
  selectTopics,
  selectArticles,
  selectArticleById,
  updateArticleById,
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

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((article) => {
      res.status(200).send({ articles: article });
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

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send(updatedArticle);
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

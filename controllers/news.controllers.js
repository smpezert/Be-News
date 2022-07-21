const {
  selectTopics,
  selectArticles,
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  addComment,
  removeComment,
  selectUsers,
} = require("../models/news.models");

const endpoints = require("../endpoints.json");

exports.getApi = (req, res, next) => {
  res.status(200).send({ availableEndpoints: endpoints });
};

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
  const { sort_by, order_by, topic } = req.query;

  selectArticles(sort_by, order_by, topic)
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

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ])
    .then(([comment]) => {
      res.status(200).send({ comments: comment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  Promise.all([
    addComment(article_id, username, body),
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id),
  ])
    .then(([newComment]) => {
      res.status(201).send({ comment: newComment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => next(error));
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

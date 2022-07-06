const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((results) => {
    return results.rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then((results) => {
      return results.rows;
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((results) => {
      if (!results.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return results.rows[0];
    });
};

exports.updateArticleById = (article_id, newVote) => {
  if (!newVote) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid input",
    });
  } else
    return db
      .query(
        "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
        [article_id, newVote]
      )
      .then((results) => {
        if (!results.rows[0]) {
          return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
          });
        }
        return results.rows[0];
      });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((results) => {
    return results.rows;
  });
};

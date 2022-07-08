const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((results) => {
    return results.rows;
  });
};

exports.selectArticles = (sort_by = "created_at", order, topic) => {
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
    .query(
      "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
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

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
    .then((results) => {
      return results.rows;
    });
};

exports.addComment = (article_id, username, body) => {
  if (!username) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid input in username",
    });
  }
  if (!body) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid input in body",
    });
  }
  return db
    .query("SELECT username FROM users WHERE username = $1", [username])
    .then((usernames) => {
      return usernames.rows;
    })
    .then(() => {
      return db.query(
        "INSERT INTO comments (article_id, author, body, votes) VALUES ($1, $2, $3, 0) RETURNING *;",
        [article_id, username, body]
      );
    })
    .then((results) => {
      return results.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((results) => {
    return results.rows;
  });
};

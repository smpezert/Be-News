const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((results) => {
    return results.rows;
  });
};

exports.selectArticles = (sort_by = "created_at", order_by = "DESC", topic) => {
  const sortedOptions = [
    "author",
    "title",
    "article_id",
    "topic",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderOptions = ["asc", "desc", "ASC", "DESC"];
  const queryValues = [];

  if (!isNaN(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Sort query should not be a number",
    });
  }
  if (!isNaN(topic)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Topic query should not be a number",
    });
  }
  if (!sortedOptions.includes(sort_by) && !orderOptions.includes(order_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid sort and order queries",
    });
  }

  if (!sortedOptions.includes(sort_by)) {
    return Promise.reject({ status: 404, msg: "Sort query not found" });
  }

  if (!orderOptions.includes(order_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid order query",
    });
  }

  let queryStr =
    "SELECT articles.*, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id";

  if (topic) {
    queryStr += ` WHERE articles.topic=$1`;
    queryValues.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order_by};`;

  return db.query(queryStr, queryValues).then((results) => {
    return results.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
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

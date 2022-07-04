const express = require("express");
const { getTopics } = require("./controllers/news.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid path" });
});

module.exports = app;

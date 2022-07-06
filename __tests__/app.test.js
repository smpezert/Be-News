const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/development-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/topics", () => {
  test("status 200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404: responds for invalid paths in topics", () => {
    return request(app)
      .get("/api/topicks")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
});

describe("GET /api/articles", () => {
  test("status 200: responds with an articles array of articles objects with the following properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(36);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("status 200: responds with an articles array of articles objects that also have a comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("status 200: responds with the articles array sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status 404: responds for invalid paths in articles", () => {
    return request(app)
      .get("/api/articules")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: responds with an article object containing the following properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("status 200: responds with a specific number of article object containing specific properties", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Running a Node App",
            topic: "coding",
            author: "jessjelly",
            body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
            created_at: "2020-11-07T06:03:00.000Z",
            votes: 0,
          })
        );
      });
  });
  test("status 200: (comment_count) responds with an article object including comment count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("comment_count");
        expect(body.comment_count).toBe("8");
      });
  });
  test("status 200: (comment_count) responds with the right data type of comment count ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { comment_count } }) => {
        expect(typeof +comment_count).toBe("number");
        expect(+comment_count).not.toBeNaN();
      });
  });
  test("status 404: responds for article_id path that there is not exist", () => {
    return request(app)
      .get("/api/articles/30000000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found for article_id: 30000000");
      });
  });
  test("status 400: responds for invalid data article_id path", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid input");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200: responds with an updated article object incrementing the votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Running a Node App",
            topic: "coding",
            author: "jessjelly",
            body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
            created_at: "2020-11-07T06:03:00.000Z",
            votes: 1,
          })
        );
      });
  });
  test("status 200: responds with an updated article object decrementing the votes", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual(
          expect.objectContaining({
            article_id: 4,
            title: "Making sense of Redux",
            topic: "coding",
            author: "jessjelly",
            body: "When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).",
            created_at: "2020-09-11T20:12:00.000Z",
            votes: -10,
          })
        );
      });
  });
  test("status 404: responds for article_id that there is not exist", () => {
    return request(app)
      .get("/api/articles/50000000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found for article_id: 50000000");
      });
  });
  test("status 400: responds for invalid data article_id path", () => {
    return request(app)
      .get("/api/articles/hi")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid input");
      });
  });
  test("status 400: responds when patch request sent with invalid data type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "thirty" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid input");
      });
  });
  test("status 400: responds when patch request sent with no data", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid input");
      });
  });
});

describe("GET /api/users", () => {
  test("status 200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(6);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404: responds for invalid paths in users", () => {
    return request(app)
      .get("/api/userz")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
});

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

describe("3. GET /api/topics", () => {
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

describe("4. GET /api/articles/:article_id", () => {
  test("status 200: responds with an article object containing the following properties", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}`)
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
  test("status 404: responds for invalid paths in article ids", () => {
    return request(app)
      .get("/api/articles/30000000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found for article_id: 30000000");
      });
  });
  test("status 400: responds for bad requests", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid input");
      });
  });
});

describe("5. PATCH /api/articles/:article_id", () => {
  test("status 200: responds with an updated article object incrementing the votes", () => {
    const article_id = 1;
    const updatedArticle = { inc_votes: 1 };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(updatedArticle)
      .expect(202)
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
    const article_id = 4;
    const updatedArticle = { inc_votes: -10 };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(updatedArticle)
      .expect(202)
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
  test("status 404: responds for invalid paths in article ids", () => {
    return request(app)
      .get("/api/articles/50000000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found for article_id: 50000000");
      });
  });
  test("status 400: responds for bad requests", () => {
    return request(app)
      .get("/api/articles/hi")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid input");
      });
  });
});

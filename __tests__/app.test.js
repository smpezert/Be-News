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

describe("Sad Paths", () => {
  test("status 404: responds for invalid paths", () => {
    return request(app)
      .get("/api/topicks")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
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
});

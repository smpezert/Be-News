const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

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
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
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
        expect(body.comment_count).toBe("11");
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

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: responds with a comments array for the given article_id in which the comment objects have the following properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status 200: responds with an empty comments array when passed a valid article_id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
      });
  });
  test("status 404: responds for invalid paths in comments", () => {
    return request(app)
      .get("/api/articles/2/coments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
  test("status 404: responds for article_id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/528694/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found for article_id: 528694");
      });
  });
  test("status 400: responds for invalid data article_id path", () => {
    return request(app)
      .get("/api/articles/bannanas/comments")
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
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 101,
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
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: "2020-05-06T01:14:00.000Z",
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
        expect(users).toHaveLength(4);
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

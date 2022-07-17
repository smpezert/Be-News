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

describe("GET /api/articles", () => {
  test("status 200: responds with an articles array of articles objects with the following properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("status 200: responds with an articles array sorted by date by default in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status 200: responds with an articles array sorted by author in descending order (default) when accepts a query", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("status 200: responds with the articles array sorted by article_id in ascending order when accepts a query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order_by=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id");
      });
  });
  test("status 200: responds with an articles array for the specified topic in the query sorted by votes in descending order (default)", () => {
    return request(app)
      .get("/api/articles?topic=cats&sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(1);
        expect(articles).toBeSortedBy("votes", { descending: true });
        expect(articles).toEqual([
          {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            comment_count: 2,
          },
        ]);
      });
  });
  test("status 200: responds with an articles array for the specified topic in the query sorted by title in ascending order", () => {
    return request(app)
      .get("/api/articles?topic=cats&sort_by=title&order_by=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(1);
        expect(articles).toBeSortedBy("title");
        expect(articles).toEqual([
          {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            comment_count: 2,
          },
        ]);
      });
  });
  test("status 404: responds for a sort query that doesn't exist (yet)", () => {
    return request(app)
      .get("/api/articles?sort_by=hi")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Sort query not found");
      });
  });
  test("status 400: responds for invalid sort queries that are numbers", () => {
    return request(app)
      .get("/api/articles?sort_by=1")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Sort query should not be a number");
      });
  });
  test("status 400: responds for invalid order queries", () => {
    return request(app)
      .get("/api/articles?order_by=hello")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid order query");
      });
  });
  test("status 400: responds for invalid sort and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=hi&order_by=hello")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid sort and order queries");
      });
  });
  test("status 404: responds for a topic query that exists, but doesn't have any articles related (yet)", () => {
    const topic = "paper";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`No articles found for the topic ${topic}`);
      });
  });
  test("status 404: responds for a topic query that doesn't exist (yet)", () => {
    const topic = "news";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Topic ${topic} not found`);
      });
  });
  test("status 400: responds for invalid topic queries", () => {
    return request(app)
      .get("/api/articles?topic=1")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Topic query should not be a number");
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
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("status 200: responds with a specific number of article object containing specific properties", () => {
    return request(app)
      .get("/api/articles/1")
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
            comment_count: 11,
          })
        );
      });
  });
  test("status 200: (comment_count) responds with the right data type of comment count ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { comment_count } }) => {
        expect(typeof comment_count).toBe("number");
        expect(comment_count).not.toBeNaN();
      });
  });
  test("status 404: responds for article_id path that doesn't exist", () => {
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

describe("POST /api/articles/:article_id/comments", () => {
  test("status 201: responds with a posted comment added to the right article", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "Amazing news!" })
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.comment).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            comment_id: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("status 201: responds with a posted comment added to the right article with correct data", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "Amazing news!" })
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.comment).toEqual({
          article_id: 1,
          body: "Amazing news!",
          votes: 0,
          author: "butter_bridge",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("status 404: responds for invalid paths in comments", () => {
    return request(app)
      .get("/api/articles/2/comentz")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
  test("status 404: responds for article_id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/123456/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found for article_id: 123456");
      });
  });
  test("status 400: responds for invalid data article_id path", () => {
    return request(app)
      .get("/api/articles/oranges/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid input");
      });
  });
  test("status 400: responds when post request sent with no body data", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: null })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid input in body");
      });
  });
  test("status 400: responds when post request sent with no username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: null, body: "Amazing news!" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Invalid input in username");
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

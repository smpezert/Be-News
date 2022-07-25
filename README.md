# Welcome to News API

## Project Summary

This project is a backend API that made as part of the Northcoders Bootcamp. The main aim of the project is to provide access to data as well as update them programmatically to a frontend architecture. The deployed version of project can be found here:

https://sobe-news.herokuapp.com/api

### Links to the API

For this project Express server and Postgres database were being used to create a functional API with multiple endpoints listed below:

- `GET /api`

- `GET /api/topics`

- `GET /api/articles`

- `GET /api/articles/:article_id`

- `PATCH /api/articles/:article_id`

- `GET /api/articles/:article_id/comments`

- `POST /api/articles/:article_id/comments`

- `DELETE /api/comments/:comment_id`

## For Developers

### Getting Started Instructions

If you would like to use the project locally, you will need to fork and clone the repository from https://github.com/smpezert/Be-News.git.

Once you have cloned down the project, go into the repository and instal all the relevant packages with the following commands:

`cd Be-News`

`npm install`

Then, to seed the local database, navigate to the repo in your terminal and write the following commands:

`npm run setup-dbs`

`npm run seed`

Next, you will need to create two .env files writing the commands:

`.env.test`

`.env.development`

Into each file, add `PGDATABASE=nc_news_test` into the `.env.test file` and `PGDATABASE=nc_news` into the the `.env.development file`.

### Minimum System Requirements

- Node.js v18.4.0 or above
- Postgres v8.12.1 or above

### Dependencies

- dotenv
- express
- pg

### Development Dependencies

- husky
- jest
- jest-extended
- jest-sorted
- pg-format
- supertest

## Author

### Sofia Bezertzi

- GitHub: https://github.com/smpezert
- LinkedIn: https://www.linkedin.com/in/sofia-bezertzi-88b92893/

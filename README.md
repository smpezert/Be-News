### Info for mandatory environment variables

This is a project that will look at the reviews of news and allow users to comment/vote on them.

If you would like to use this project then you will need to fork and clone the repository from https://github.com/smpezert/Be-News.git.

Once you have cloned down the project, be sure to run `npm install` to instal all the relevant packages.

You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.

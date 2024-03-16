---
title: Homework 1
sidebar_position: 1
---

For your first assignment, you’ll write a Node back-end similar to [CS375’s HW5](https://www.cs.drexel.edu/~nkl43/cs375_fall_2023-24/course_site/homeworks/5_database/), but REST-y, in Typescript, and with automated tests.

Your goal is to write a Node server using [Express](https://expressjs.com/) that supports adding, getting, and deleting books and authors. You don’t need to write any front-end code for this assignment. You’ll store books and authors in a SQLite database with the following tables:

```sql
CREATE TABLE books (
    -- unique book id, can change to be integer if you want
    id TEXT PRIMARY KEY,
    author_id TEXT, -- should equal an author id in authors table
    title TEXT,     -- book title
    pub_year TEXT,  -- 4 digit string publishing year, e.g. "1867"
    genre TEXT,     -- book genre (adventure, sci-fi, etc.)
    -- enforces that author_id maps to valid id in authors table
    FOREIGN KEY(author_id) REFERENCES authors(id)
);

CREATE TABLE authors (
    -- unique author id, can change to be integer if you want
    id TEXT PRIMARY KEY,
    name TEXT, -- author name
    bio TEXT   -- short author biography
);
```

Your API should follow REST API best practices and support POST, GET, and DELETE requests. Your code should be written in Typescript and avoid using `any` types where possible. Your code should also have an automated test suite that covers most of the major functionality of your assignment.

### REST API

Your API should send and receive JSON, and follow the basic REST API best practices as described [here](/misc/rest-apis). Additionally, it should support:

- POST, GET, and DELETE requests to create, fetch, and delete resources (respectively).
- GET requests to fetch a single book/author by ID and all books/authors.
- Using query strings with GET requests to filter along at least one book or author property, e.g. searching for all books published on or after a certain year.

You’ll have to think about how you want to design your API. Here is an incomplete list of issues you might want to consider:

- Should users have to create unique IDs for their resources, or will you do that for them? If the former, how will they know what kind of IDs to create and if they’re unique? If the latter, how will you return that ID to them (as they’ll need the ID to perform future actions on that resource)?
- Any data accepted from a client needs to be validated to ensure it’s correct. What constraints should you enforce? Will you restrict genres to a certain subset of values?
- Books are associated with authors. Should you be able to create a book without a valid author ID? Should you be able to delete an author that still has books associated with them?

### SQLite

[SQLite](https://www.sqlite.org/index.html) is a self-contained database that supports SQL. Most databases, like MySQL and PostgreSQL, run a database server in the background and accept SQL queries through network requests. But SQLite is serverless — it’s really just an API to write to a file in a structured way. Instead of starting a SQLite server in the background, you’ll simply import a SQLite driver that calls SQLite to write your data to a local database file of your choosing.

If you’re running macOS, SQLite is already installed — just run `sqlite3` from the command line. Otherwise, you’ll need to install it ([see here](https://www.servermania.com/kb/articles/install-sqlite/) for instructions).

To use it with Node, you’ll need to install a driver. I recommend using the [node-sqlite](https://github.com/kriasoft/node-sqlite) wrapper around the [sqlite3](https://github.com/TryGhost/node-sqlite3) driver because it provides a Promise-based API.

Each database system has its own flavor of SQL. [This page](https://www.sqlite.org/lang.html) has guides on the syntax of SQLite’s SQL queries. Search around for sample queries if needed.

You should stick with the table schema given above, but if you want to change the `id` fields to be of type `INTEGER`, you can do that.

### Typescript

Your server should be written using Typescript. See below for a starter project. It’s configured to use ES modules, so instead of using `require` to import packages, you’ll use the newer [import/export syntax](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export).

Where possible, you should avoid using the `any` type and make your types as specific as is reasonable, especially when using Express and Axios. 

Some tips:
- Both Express and Axios are any-typed by default, but you can add types to specify the type of the response. This is particularly useful to ensure that your HTTP responses have the data you expect.
- In VSCode, you can right click on a variable and click “Go to Type Definition”, even if the variable’s type comes from a package like Express.
- I recommend using [zod](https://github.com/colinhacks/zod), a Typescript package for creating schemas to validate untrusted data, for extracting data from request queries and bodies.
- You can use intersection types to avoid duplication.

While writing code, you should keep track of which bugs Typescript catches/doesn’t catch for your reflection.

### Tests

The starter project given below uses the [Jest](https://jestjs.io/docs/using-matchers) testing library. You’re welcome to switch to another testing library if you wish — Jest is popular.

Your tests should cover at least some percentage of each request handler you implement. Write tests until you feel like you could refactor your code with confidence. 

### Private git repo

Your first deliverable for this assignment is your code. Your code should be in a private git repo that I can clone (Github, Gitlab, etc.). Your repo should be accessible to be able to compile, run, and test your code with the provided commands.

In subsequent assignments, you’ll add features to the code you wrote for this assignment, using the same repo.

### Reflection

Your second deliverable for this assignment is a reflection, which should be posted on the website you set up in the first week of class. Your reflection should address topics related to coding, Typescript, testing, etc.

### Starter code

Starter code is provided [here](//starter.zip). cd into the starter code folder and run `npm i` to install dependencies.

**Tips:**
- If you’re truly not able to figure out how to type something, give it type `any` and move on.
- If you’re having trouble with your configuration, please reach out for help.
- Feel free to work with other people. 
- You may find it helpful to write your tests first and then implement each request handler as you go.

### Grading

Submit a text file named `<drexel-username>.txt` with the links to your git repository and reflection post. Your submission will be graded based on the quality of your reflection, how well-typed and well-tested your code is, and whether your code works.
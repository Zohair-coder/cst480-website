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

Your deliverables will be a private code repo I can clone to run your tests and a reflection post on your personal website describing your code and design choices.

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
- I recommend using [zod](https://github.com/colinhacks/zod), a Typescript package for creating schemas to validate untrusted data, for extracting data from request queries and bodies. You can use the infer method to derive types from your schemas.
- You can use intersection types to avoid duplication. For example, if my API requests contained objects with `type Food = { name: string, quantity: number }`, but my database added an ID that I wanted to send back to the user, I could create `type FoodRow = Food & { id: string }` and use `Food` for my requests and `FoodRow` for my responses.

While writing code, you should keep track of which bugs Typescript catches/doesn’t catch for your reflection.

## Tests

The starter project given below uses the [Jest](https://jestjs.io/docs/using-matchers) testing library. You’re welcome to switch to another testing library if you wish — I picked Jest because it’s popular.

The sample tests use [Axios](https://axios-http.com/docs/intro) to query your Express server. Axios is a promise-based API. Instead of adding a bunch of `.then` and `.catch` calls, you may find it more convenient to use the [async/await](https://javascript.info/async-await) syntax. When using async/await, you can use try/catch to handle errors, unlike with regular promises ([see here](https://stackoverflow.com/a/24977580/6157047)).

Some tips:

- Jest runs `test` blocks in a different order each time. Group related `expect` statements in the same `test` block to avoid weird bugs.
- Since you’re testing a stateful API, you’ll probably want to delete all rows in your tables before the next set of tests runs. The easiest way to do this is with a teardown function (see [here](https://jestjs.io/docs/setup-teardown)).
- Remember to make the function you pass to `test` async if your test uses await (see [here](https://jestjs.io/docs/asynchronous#asyncawait)).

Your tests should cover at least some percentage of each request handler you implement. Most importantly, your tests should give you confidence that your code works correctly. Write tests until you feel like you could refactor your code with confidence, but you don’t need to write hundreds of tests or reach 100% code coverage.

## Private git repo
Your first deliverable for this assignment is your code. Your code
should be in a private git repo that I can clone (Github, Gitlab, etc.).
Remember to give me access:
- If your repo is on Github, my username is galenlong.
- If your repo is on CCI’s Gitlab, my username is nkl43.
- If your repo is on the public Gitlab, my username is galenlong.

I will expect to be able to compile, run, and test your code with the
following commands:

```bash
git clone <your-repo>
cd <your-repo>
npm i # install dependencies
npm run setup # set up your SQLite database
npm run build # compile your server
npm run start # start your server
# in another terminal...
npm run test # run your tests
```

In subsequent assignmnets, you’ll add features to the code you wrote
for this assignment, using the same repo. I’ll grade your code for this
assignment based on the last commit you made before you submit on
Blackboard.

## Reflection
Your second deliverable for this assignment is a reflection, which
should be posted on the website you set up in the first week of class.
Your reflection post should address the following topics:

1. Coding
   - How long did you spend on this assignment? If you don’t remember,
give a rough estimate. It’s okay if you spent very little/a lot of time
on the assignment — answering this question honestly will help me figure
out how to balance out this course.
   - Where did you spend the most time? Fixing configuration, figuring
out Typescript, designing your API, writing tests, debugging your
request handlers, etc.?
   - What did you struggle with the most? What would’ve improved your
experience on this assignment?
   
2. Typescript
   - Keep track of the bugs Typescript helped you catch and the ones it
didn’t catch. What are some of the issues Typescript helped you prevent?
What are some of the holes in the type system?
   - What kinds of values did you struggle to type correctly? Are there
any Typescript topics that are still confusing you?
   
3. Testing
   - What was your experience writing tests? Was it boring, soothing,
rewarding? How did they affect your development process?
   - Did your tests help you find any bugs? If so, which ones?
   - How would you structure your testing differently in the future? What
did you learn while testing?

There is no minimum length requirement. As long as your reflection
addresses all of the above questions, it’s sufficient. Your reflection
will be more interesting if it’s honest; for example, if Typescript and
testing felt like more of a hindrance than a help, reflecting on why may
help you grow as a developer.

## Starter code
Starter code is provided [here](//starter.zip). cd into the
starter code folder and run `npm i` to install
dependencies.

Take a look in the package.json. All commands under the “script”
object can be executed with `npm run <command>`:
- `npm run setup` executes the SQL commands in setup.sql
and creates a database.db file to store your SQLite database. Run this
once to set up your tables before running your server. Running this
again will delete your tables and recreate their schemas from
scratch.
- `npm run build` compiles the .ts files in src/, writing
.js files to out/.
- `npm run start` compiles and then starts the server.
- `npm run watch` uses [tsc-watch](https://github.com/gilamran/tsc-watch) to start a
process that watches your src/ files for changes. When you change your
source code and save, it’ll automatically recompile your code and
restart the server. If your code doesn’t compile when you initially run
this command, you’ll need to get it to compile before the file watcher
will start watching your files and recompiling automatically. This is a
handy tool to make development more efficient.
- `npm run test` runs the Jest tests. You should have the
server running in another terminal window when you run them.

> Some of the npm script commands might not work if you’re on Windows.
You may have to google around to find suitable replacements, e.g. [rimraf](https://github.com/isaacs/rimraf) for the
`rm -rf` command.

I like to have one terminal running `npm run watch` and
another terminal open so I can periodically run
`npm run test` (and `npm run setup` if I want to
clear my DB to start fresh).

The other files are as follows:
- tsconfig.json contains the Typescript compiler options. You
hopefully won’t have to modify this.
- jest.config.ts contains configuration for Jest. You hopefully won’t
have to modify this.
- .prettierrc.json contains configuration for Prettier, a JS code
formatter. I recommend configuring your text editor to automatically run
Prettier whenever you save your files.
    - VSCode has a [prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode). If you go to Settings > Preferences and search “format
on save”, you can toggle that option and then you’ll be prompted to set
Prettier as the formatter for TS/JS files.

## Tips
- If you’re truly not able to figure out how to type something, give
it type `any` and move on. You may be able to find a better
way to type it later, and there’s no sense in blocking all of your
progress trying to figure one type out.
- If you’re having trouble with your configuration, please a) let me
know if you fix something to get it working and b) feel free to reach
out to me for help. I don’t have a Windows machine so I’d appreciate
having someone’s to try things out on so I can eventually arrive at a
config that works for everyone.
- Feel free to work with other people. As long as ultimately, your
work is your own and you’re learning, it’s fine.
- Feel free to use tools like Github Copilot for the more tedious code
(particularly the tests). I personally recommend writing the request
handlers without it because it might hinder your learning, but it’s up
to you.
- You may find it helpful to write your tests first and then implement
each request handler as you go. That way, you’ll know if your code is
working immediately.

## Grading
Submit a text file exactly named
`<drexel-username>.txt` (e.g. `abc123.txt`)
in the exact following format to Blackboard:

```
<link to your git repository>
<link to your reflection post>
```

Don’t zip it. Just submit the plain .txt file. **Your text file
should not include any additional text besides the links.** It
should not say something like `Repo: <link>` — just
`<link>`.

Your submission will be graded based on the quality of your
reflection, how well-typed and well-tested your code is, and whether
your code works.
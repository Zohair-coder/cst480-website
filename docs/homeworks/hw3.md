---
title: Homework 3
sidebar_position: 3
---

For this assignment, you’ll add the following features to your web
app:
- A back-end endpoint to edit a book’s information (title, author,
publication year, and genre).
- Some automated tests to ensure your endpoint works correctly.
- A front-end interface to edit a book’s information.
- A front-end interface to delete a book.
- Styling using the [Material UI](https://mui.com/) library
components.
- Optional task: Add an end-to-end test to verify that adding a book
through the UI successfully adds a book.

Additionally, you’ll add an npm script called `test-data`
that will populate your database with testing data, for ease of testing
and grading.

As before, your deliverables will be your git repo and a reflection
posted on your personal site.

## Editing endpoint
Your editing endpoint should be REST-y. See the [REST resources page](/misc/rest-apis) for tips on how to structure
your API.

The endpoint will be probably be similar to the POST endpoint, but
it’ll make an UPDATE query instead of an INSERT query. See if you can
reuse any of your validation logic.

## UI design
Consider how to integrate the editing and deletion into your UI. The
edit and delete interfaces should be self-explanatory, include
client-side validation where appropriate, and be accessible from the
main interface of your app (meaning that I shouldn’t need to manually
type a route into the URL bar to access the editing page).

I recommend searching around for UX guidelines and best practices.
Material UI contains some pre-built components you may find useful, if
you want to implement [inline editing](https://mui.com/x/react-data-grid/editing/).
Note that destructive operations, like deletion, often prompt the user
for confirmation before they’re performed.

## Optional end-to-end test
As an optional task, you can add an end-to-end test to check that
correctly adding a book through the UI form successfully adds it to the
DB. You can check to see if the book was added by sending a GET request
after the submit button is clicked.

> An end-to-end test checks that a complete “user flow” (e.g. logging
in, or in this case, adding a book) works correctly. For a web app,
end-to-end usually means interacting automatically with the UI to
perform an operation, then checking to see that it was done correctly
(e.g. by querying the API to ensure data was added, or checking if the
user was successfully redirected to a logged in page).

I’ve heard [Playwright](https://playwright.dev/) is good
for reliably triggering browser events (like clicking the submit button
and entering data into the form), and it now has experimental [support for React
components](https://playwright.dev/docs/test-components). You could also just use React’s [testing library](https://reactjs.org/docs/testing.html), but
that’s more oriented toward asserting things about the component UI in a
mocked environment and less oriented towards end-to-end tests.

## Git repo
Your first deliverable for this assignment is your code. Use the same
repo that you used for your previous assignment.

I’ll use the same commands as previous to run and test your app, with
one addition: you’ll add a `test-data` npm script that should
pre-populate your database with data, which I’ll run right after your
setup script. Here is the full list of commands I’ll run while
grading:

```
# clones your repo into a folder named <some-folder>
git clone <your-repo> <some-folder>
cd <some-folder>

cd back/
npm i
npm run setup
npm run test-data # new
npm run start

# in another terminal...
cd front/
npm i
npm run dev
# I'll visit whatever URL vite prints out to see your site
```

## Reflection
Your second deliverable for this assignment is a reflection, which
should be posted on the website you set up in the first week of class.
Your reflection post should address the following topics:
1. UI
    - How did you integrate the book editing and deletion into your UI?
    Why did you choose the design you did?
    - What parts (if any) did you struggle with when implementing
    edit/delete in the UI?
2. Material UI
    - How easy was it to refactor your existing UI to use Material UI?
    What pitfalls did you run into trying to use it?
3. Editing endpoint
    - How difficult was it to add the editing endpoint and associated
    tests? Did your experience writing the POST endpoints make writing the
    editing endpoints smoother?

There is no minimum length requirement. As long as your reflection
addresses all of the above questions, it’s sufficient. Your reflection
will be more useful for your learning if it’s honest.

## Grading
Submit a text file exactly named `<drexel-username.txt>` (e.g. `abc123.txt`)
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
reflection, code, and UI design.
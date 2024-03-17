---
title: Homework 2 - Adding a React front-end
sidebar_position: 2
---

For this assignment, you’ll add a React front-end to your back-end from Homework 1. Your React code should be written in Typescript and use [hooks](https://react.dev/reference/react/hooks) instead of class-based components.

> Before React v16.8, components used to be written with classes, e.g.:

> ```jsx
> class Timer extends React.Component {
>      constructor(props) {
>       super(props);
>       this.state = { count: 0 };
>      }
>      render() {
>       return (
>           <button onClick={() => this.setState(state => ({count: state.count + 1}))}>
>                 I've been clicked {count} times
>           </button>
>       );
>      }
> }
> ```

> Now all React components are written as functions that call hooks like `useState`, example [from here](https://legacy.reactjs.org/docs/hooks-intro.html):

> ```jsx
> function Example() {
>   const [count, setCount] = useState(0);
>   return (
>     <button onClick={() => setCount(count + 1)}>
>       I've been clicked {count} times
>     </button>
>   );
> }
> ```

> If you see React code written using classes, that means it’s old. Your code should be written with hooks.

Your front-end should have:

1. Forms to add books and authors, which send POST requests to your API, adding them to your SQLite database.
   - When a form is submitted, you should display feedback about whether the request was successful, and if not, why it failed.
2. A table that displays all books in the database, sorted alphabetically, constructed from a GET request to your API.
3. A search input that allows you to search for all books that meet some criteria (e.g. display all books published after some year).

You can refactor your back-end as needed to work better with your front-end, though you’ll want to keep track of the changes you made for your reflection (see below).

You’re not required to write automated tests of your front-end or add extensive CSS styling for this assignment. We’ll add styling in a later assignment, so don’t bother styling it significantly now.

As before, your deliverables will be your git repo and a reflection posted on your personal site.

## Adding React to your project
You should integrate React into your current project like we did for Activity 2b. Put your back-end code for Homework 1 into a folder called `back/`. In the folder that contains your `back/` folder, run the following command:

```bash
npm create vite@latest front -- --template react-ts
```

This will create a React Typescript project using Vite in a folder named `front/`. When finished, your directory structure should look like:

```
.
├── back
│   ├── database.db
│   ├── out
│   │   └── ...
│   ├── package-lock.json
│   ├── package.json
│   ├── setup.sql
│   ├── src
│   │   └── ... YOUR SERVER SOURCE CODE
│   └── tsconfig.json
└── front
      ├── README.md
      ├── dist
      │   └── ...
      ├── index.html
      ├── package-lock.json
      ├── package.json
      ├── public
      │   └── ...
      ├── src
      │   ├── ... YOUR CLIENT CODE GOES HERE
      │   ├── main.tsx
      │   └── vite-env.d.ts
      ├── tsconfig.json
      ├── tsconfig.node.json
      └── vite.config.ts
```

> [See here](https://vitejs.dev/guide/) to learn more about Vite.

To run your code, you’ll need one terminal running your back-end server and another terminal running `npm run dev` from your `front/` folder, which will run Vite’s dev server displaying your React code. The dev server has hot module reloading, so every change you make will be automatically reflected in your browser.

I recommend moving your back-end routes behind some kind of `/api` route to keep them separate from your front-end pages (e.g. `POST /api/authors` instead of `POST /authors`), if you haven’t already. You can then add the following to your `vite.config.ts` file:

```javascript
export default defineConfig({
  // ...
  server: {
    proxy: {
      "/api": "http://localhost:3000", // this should match the URL your server is running on
    },
  },
});
```

This will ensure that your front-end requests to routes like `/api/books` get proxied to your back-end. This is necessary because Vite will run a development server to preview your React files on a different port, so without this, you’d need to type the full URL before every request (e.g. `fetch("http://localhost:3000/api/books")` vs `fetch("/api/books")`).

## Structuring your UI
I should see some kind of React page when I visit the `/` route. Besides that, it’s up to you to figure out how to structure your UI. You may want to look at how other sites lay out forms, tables, and search inputs, e.g. [Goodreads](https://www.goodreads.com/).

You don’t need to focus on writing a lot of CSS for the individual components, but they should be laid out on the page sensibly (e.g. all input fields shouldn’t be crammed together on the same line with uneven spacing), and it should be obvious what each component does (e.g. all input fields should have an associated label).

Similarly, your UI should be discoverable, meaning that I shouldn’t have to read a README to know how to navigate your site. If your front-end has multiple pages, the home page should link to them — I shouldn’t need to type routes into the URL bar directly.

Consider how to handle errors, especially around form submission. Ideally, your error messages would be as specific as possible (e.g. “‘name’ must be at minimum length 1” versus “Invalid ‘name’”) to make it clear to the user what went wrong.

## Typescript
Your front-end code should be written in Typescript. You should avoid `any` types where reasonable. Most popular front-end packages come with types that you can import. Additionally, you should consider how to use types effectively when querying your API back-end.

## Tips on using ESLint
Hooks can be challenging to use correctly, particularly with the [rules of hooks](https://react.dev/warnings/invalid-hook-call-warning). Vite automatically installs ESLint, a JS linter, and assorted ESLint rules that check to make sure your code follows the rules of hooks. To enable linting when Vite runs your code, install `vite-plugin-eslint`

```bash
npm i -D vite-plugin-eslint
```

and then add `eslint()` to the plugins array in `vite.config.ts`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint"; // ADDED THIS

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()], //ADDED eslint() TO ARRAY HERE
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
```

By default, Vite won’t run ESLint when you first run `npm run dev` because it can be a little slow; it’ll only print ESLint errors when you execute code that has the linting error. You can change this by passing a config option to the `eslint` function, like so: `plugins: [react(), eslint({ lintOnStart: true })]`. Enabling this will cause `npm run dev` to fail when first run if your code contains any linting errors. If you successfully run `npm run dev` and then introduce a linting error, it won’t quit the dev server — as soon as you fix the error, Vite will reload the server and refresh the page as usual.

> You can see a full list of configuration options for the Vite ESLint plugin [here](https://www.npmjs.com/package/vite-plugin-eslint).

ESLint rules tend to be pretty strict and Vite won’t run your code if it has any linting errors. To disable certain ESLint rules, you can add exceptions to the `rules` object in the `.eslintrc.cjs` file that Vite creates automatically. For example, I added these rules to my `.eslintrc.cjs`:

```javascript
module.exports = {
  // ...
  rules: {
    // ...
    "prefer-const": "off", // let is fine who cares
    // note that you can also avoid getting warned for unused variables
    // when destructuring arrays by just using commas in cases like this:
    // e.g. let [, x] = [1, 2, 3]; console.log(x);
    "@typescript-eslint/no-unused-vars": "off", // annoying when developing
    "@typescript-eslint/no-explicit-any": "off", // sometimes it really can be anything, dude
  },
};
```

You can tell what the name of a rule is because ESLint will print it when it prints the linting error, e.g. to disable this error message:

```
31:45  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
```

you’d add `"@typescript-eslint/no-explicit-any": "off"` to `.eslintrc.cjs`. If you change the `.eslintrc.cjs`, you might have to rerun `npm run dev` to see the changes.

You can check that ESLint is working by intentionally adding broken code. For example, if you add this to any of your React components

```javascript
let foo = 3;
if (foo === 3) {
  let [bar, _] = useState(0);
  console.log(bar);
}
```

this will violate the rules of hooks, which require that hooks must only be called at the top level of a component, so you’d see this ESLint error when you run the component you put this error in:

```
38:20  error  React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render  react-hooks/rules-of-hooks
```

## Tips on using React
You’ll need to send HTTP requests to get/send data for your books table/forms; you can use whatever browser API or package you like for this. I like [Axios](https://axios-http.com/docs/intro).

If you use the response from an HTTP request to update a component’s state (e.g. when you fetch data for your books table), you’ll need to use the useEffect hook to make the request. useEffect is one of the trickiest hooks to use correctly; see [here](https://react.dev/learn/synchronizing-with-effects) and [here](https://www.robinwieruch.de/react-hooks-fetch-data/) for guides.

Using forms in React requires a little extra work because forms have their own internal state that React can’t control. You can control each [input](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable), [select](https://react.dev/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable), and [textarea](https://react.dev/reference/react-dom/components/textarea#controlling-a-text-area-with-a-state-variable) element, and define a button that sends a POST request when clicked. Or you can use the [react-hook-form package](https://react-hook-form.com/), which provides a hooks-based API for form submission/validation for you.

If you add console logs to your components, you’ll see that your components are getting rendered twice. This is because the Vite starter code uses React’s strictMode, which renders all components twice to surface bugs; [see here](https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-double-rendering-in-development) for details. strictMode only runs your components twice in development, not production, so don’t worry about it.

If your UI has multiple “pages”, you should use [React Router](https://reactrouter.com/en/main/start/tutorial) to ensure the URL gets updated and the back button works when “links” are clicked.

When writing front-end code that calls your back-end endpoints, you might find yourself wanting to reuse the types from your back-end so you can type the responses. Unfortunately, this is quite hard to achieve without restructuring your entire project because your front and back-end projects are two separate projects with two separate compilation configurations. If you want to try doing this anyway, you may find packages like [tRPC](https://trpc.io/) and/or features like [npm workspaces](https://earthly.dev/blog/npm-workspaces-monorepo/) helpful.

## Git repo

Your first deliverable for this assignment is your code. **Use the same repo that you used for your previous assignment**.

> When grading prior assignments, I’ll clone your repo and then hard reset it so I only see commits as of the timestamp of your Blackboard submit time for that assignment. This means that committing to the same repo for future assignments won’t disrupt the grading of prior assignments. This also means that if you update your code after you submit on Blackboard, you should resubmit on Blackboard so I see your changes.

I will expect to be able to compile and run your code with the following commands:

```bash
# clones your repo into a folder named <some-folder>
git clone <your-repo> <some-folder>
cd <some-folder>

cd back/
npm i
npm run setup
npm run start

# in another terminal...
cd front/
npm i
npm run dev
```

Make sure to serve React content to the `/` route.

## Reflection

Your second deliverable for this assignment is a reflection, which should be posted on the website you set up in the first week of class. Your reflection post should address the following topics:

1. Design
   - Keep track of the changes you made to your back-end as you implemented your front-end. What changes did you need to make and why? Would you structure your back-end differently in the future?
   - Did you also perform client-side validation or did you rely on server-side validation alone? What are the pros/cons of making either choice?

2. React
   - What was your experience manipulating state with React components (especially with the `useEffect` hook)? What kinds of things did you struggle with?
   - What was your experience using types with the front-end? Did they catch any bugs? Did you have to make a lot of manual annotations? Did you resort to using `any` frequently, and if so, why?

3. Compare and contrast your experiences writing an SPA front-end with React to writing a MPA front-end like we did in CS375. Which was harder? Which did you enjoy more? How did you feel about the experience generally?

There is no minimum length requirement. As long as your reflection addresses all of the above questions, it’s sufficient. Your reflection will be more useful for your learning if it’s honest.

## Grading

Submit a text file exactly named `<drexel-username>.txt` (e.g. `abc123.txt`) in the exact following format to Blackboard:

```
<link to your git repository>
<link to your reflection post>
```

Don’t zip it. Just submit the plain .txt file. **Your text file should not include any additional text besides the links**. It should not say something like `Repo: <link>` — just `<link>`.

Your submission will be graded based on the quality of your reflection, code, and UI design.
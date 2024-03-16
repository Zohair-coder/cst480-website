---
title: Homework 2
sidebar_position: 2
---

For this assignment, you’ll add a React front-end to your back-end from Homework 1. Your React code should be written in Typescript and use [hooks](https://react.dev/reference/react/hooks) instead of class-based components.

Before React v16.8, components used to be written with classes, e.g.:

```jsx
class Timer extends React.Component {
     constructor(props) {
      super(props);
      this.state = { count: 0 };
     }
     render() {
      return (
          <button onClick={() => this.setState(state => ({count: state.count + 1}))}>
                I've been clicked {count} times
          </button>
      );
     }
}
```

Now all React components are written as functions that call hooks like `useState`, example [from here](https://legacy.reactjs.org/docs/hooks-intro.html):

```jsx
function Example() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      I've been clicked {count} times
    </button>
  );
}
```

If you see React code written using classes, that means it’s old. Your code should be written with hooks.

Your front-end should have:

1. Forms to add books and authors, which send POST requests to your API, adding them to your SQLite database.
   - When a form is submitted, you should display feedback about whether the request was successful, and if not, why it failed.
2. A table that displays all books in the database, sorted alphabetically, constructed from a GET request to your API.
3. A search input that allows you to search for all books that meet some criteria (e.g. display all books published after some year).

You can refactor your back-end as needed to work better with your front-end, though you’ll want to keep track of the changes you made for your reflection.

You’re not required to write automated tests of your front-end or add extensive CSS styling for this assignment. We’ll add styling in a later assignment, so don’t bother styling it significantly now.

As before, your deliverables will be your git repo and a reflection posted on your personal site.

## Adding React to your project

You should integrate React into your current project like we did for Activity 2b. Put your back-end code for Homework 1 into a folder called `back/`. In the folder that contains your `back/` folder, run the following command:

```bash
npm create vite@latest front -- --template react-ts
```

This will create a React Typescript project using Vite in a folder named `front/`.

...

### Git repo

Your first deliverable for this assignment is your code. **Use the same repo that you used for your previous assignment**.

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
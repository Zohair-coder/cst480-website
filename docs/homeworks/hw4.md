---
title: Homework 4 - Adding authentication, deploying, and securing your app
sidebar_position: 4
---

For this assignment, you’ll add the following features to your web app:

- A username and hashed password table, using [Argon2](https://github.com/ranisalt/node-argon2) for hashing.
- A login flow. This should consist of a front-end login form that sends the inputted credentials to a back-end login endpoint. The endpoint should store a unique token in the response cookies if the credentials are valid, or return an error if they’re not.
- A create account flow. This should not allow users to register accounts with already taken usernames.
- Authorization. Modify your app so that users can only change book/author data (add, edit, or delete) if they’re logged in. Users should also only be able to edit/delete books that they themselves created.
  - The UI should display appropriate errors or use conditional rendering to make unauthorized actions invisible if the user isn’t logged in.
  - Note that all books should still be visible to all users, whether logged in or not.

Additionally, you’ll deploy the app to the public internet and conduct a security audit.

You should modify your npm `test-data` script to populate your users table with some usernames and hashed passwords, for ease of testing and grading the UI.

Your deliverables will be your a) git repo, b) reflection posted on your personal site with your security audit, and c) a link to your deployed site.

## UI Design

### Some things to consider:

- How should the login flow work? If the user’s credentials are invalid, what should they see? If the user successfully logs in, what should happen next? Should they be redirected to another page? Should the home page change to display "Welcome `<username>`!” somewhere? Etc.
  - If you want to display a persistent message like “welcome `<username>`”, you may want to store the username in a cookie so the front-end can remember it, or if you want to go the extra mile, look into [server-side rendering](https://blog.logrocket.com/improve-app-performance-react-server-side-rendering/) (though this will complicate your back-end endpoints).
- Should a user still be able to see the books table even if they’re not logged in?
- How will you let the user know if they’re not permitted to perform an action? You could conditionally render different components depending on whether the user is logged in or not, or display error messages if they attempt an unauthorized action.
- How do other websites design their create account forms and flows? E.g. When a user successfully creates an account, should they automatically be logged in? Etc.

## Authorization

Remember that even if you restrict an action on the client-side, a user can always circumvent that by using a non-browser client (like curl). Your back-end endpoints to edit, delete, and add a book/author should first check if the user is logged in before performing any actions, and then check (in the case of edit/delete) that the user sending the request is the same user that created the book/author.

This will require checking that the token inside the cookie is valid, which will require storing your tokens when they’re generated on login. You could use a global object like we did in the activity or store them in another database table.

Additionally, you’ll need to perform server-side validation when the user tries to create an account (e.g. check that the username isn’t already taken).

## Deploying your site

You can use the same server you’re using to serve your course site (where you post your reflections) to serve your web app.

To deploy the back-end, the easiest way to achieve this is to run your Node app on your server at some localhost port, then add an entry to your Caddyfile to redirect requests to a specific route or subdomain to your Node app’s localhost address.

For example, you might configure Caddy to redirect requests to mycoolsite.com/hw4 (route) or api.mycoolsite.com (subdomain) to your Node app’s localhost address. If you choose to redirect the route, you may want to use the [rewrite](https://caddyserver.com/docs/caddyfile/directives/rewrite) directive to remove the path from the URL (or else your API/front-end will need to change all of its request handlers). If you choose to redirect the subdomain, you’ll need to add DNS records for it that point to the same IP addresses as your domain, and you may run into CORS issues when your front-end tries to make requests to your API.

Additionally, you’ll want to persistently run your server so it doesn’t quit as soon as you close the terminal session. Instead of running `npm run start`, you can create a new command that uses the [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) package to run your server, which will run it in the background and can be configured to auto-restart on error.

To deploy the front-end, run `npm run build` in your front/ folder, which will create a folder named dist/ with all of your site assets — the compiled/minified code, the index.html, fonts, and any images/CSS files. You want to statically serve this dist/ folder at some URL (e.g. mycoolsite.com/hw5, hw5.mycoolsite.com, etc.; the above notes about serving via subdomain vs route apply here as well).

You can configure Caddy to statically serve the dist/ folder just like you’re statically serving your course site, though note that if your front-end is being served from a different URL than your back-end, you might run into CORS issues. You could also move the dist/ folder inside your Node app’s folder and add `app.use(express.static("dist"))` to your server.ts to have it statically serve your front-end along with the API.

The best way to get your code on your server is to clone your repo. To do this, you’ll need to set up ssh keys with your Git platform (Github, Gitlab, etc.). [See here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) for more information.

## Security features to add

You should add the following features to your deployed homework app:

- Rate limiting on requests. If a user attempts to send too many requests (e.g. to brute force a password), you should block that user from making future requests. This can be done at the firewall level using packages like [fail2ban](https://www.fail2ban.org/wiki/index.php/Main_Page) and/or the application level in Express (you’ll probably find it easier to configure Express than to use fail2ban).
- Security-related HTTP headers. You should add HTTP headers like the [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP). You might consider using a project like [Helmet](https://helmetjs.github.io/) to add them automatically.

You might also need to add other features to secure your app; see below.

## Security audit

You should audit your app to see if it’s vulnerable to the following attacks. If it is, you should take steps to prevent the attack in your code. If it’s not, you should explain why in your reflection (see below for details):

- Cross-site scripting attacks (XSS). This is when an attacker is able to add code to your site that then gets executed in other users’ browsers. The prototypical example is submitting JS like `<script>alert("Hello")</script>` in some form (e.g. as a username when creating an account) that then gets served in an executable context in the HTML to other users (e.g. a page with a list of all usernames in the site; if another user views that list, they’ll see the script tag, and if the script tag was added in an insecure way to the HTML, it’ll execute, which is an XSS vulnerability).
- Cross-site request forgery (CSRF). This is when an attacker tricks a user into visiting a webpage that sends a request to your site with the user’s cookies. For example, if you had a GET endpoint to delete your account that checked to see if the user’s token cookie was valid, an attacker could create a link to `http://your-site/delete-account`, trick a user into clicking on it (e.g. with a phishing email), and if the user’s cookies are sent along with the request, the user’s account will be deleted.

## Git repo

Your first deliverable for this assignment is your code. Use the same repo that you used for your previous assignment.

I’ll use the same commands as previous to run and test your app, with one addition: you’ll add a `test-data` npm script that should pre-populate your database with data, which I’ll run right after your setup script. Here is the full list of commands I’ll run while grading:

```bash
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
```

## Reflection

Your second deliverable for this assignment is a reflection, which should be posted on the website you set up in the first week of class. Your reflection post should address the following topics:

1. UI
   * What did you struggle with when adding logins and authorization to your front-end?

2. Login endpoint
   * What did you struggle with when adding logins and authorization to your back-end?

3. Security audit
   * If your app was vulnerable to XSS attacks, explain what you did to mitigate them. If it wasn’t, explain why.
   * If your app was vulnerable to CSRF attacks, explain what you did to mitigate them. If it wasn’t, explain why.
   * If you added rate limiting with a firewall, include what commands you ran/packages you used. If you added rate limiting to your application code, indicate this.
   * Explain what HTTP headers you set, what they do, and why they’re useful.
   * If you did anything else to secure your app, explain what you did and why.

There is no minimum length requirement. As long as your reflection addresses all of the above questions, it’s sufficient. Your reflection will be more useful for your learning if it’s honest.

## Grading

Submit a text file exactly named `<drexel-username>.txt` (e.g. `abc123.txt`) in the exact following format to Blackboard:

```
<link to your git repository>
<link to your reflection post>
<link to your deployed site>
```

Don’t zip it. Just submit the plain .txt file. **Your text file should not include any additional text besides the links.** It should not say something like `Repo: <link>` — just `<link>`.

Your submission will be graded based on the quality of your reflection, code, and UI design.
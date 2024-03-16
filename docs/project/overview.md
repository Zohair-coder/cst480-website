---
title: Overview
sidebar_position: 1
---

## Project overview
For your final project, you’ll work in groups of 2-5 to develop a full-stack web application.

Your project must:
- Be written in HTML, CSS, and TypeScript
- Have a Node.js backend
- Have a React front-end
- Be deployed to the public internet
- Have at least some automated tests of your backend, and optionally, your frontend (your tests don’t need to be completely exhaustive, but if your test suite passes, this should be a signal that your code is mostly working)

Your project must have a large enough scope so that you’ll need all remaining weeks of the term and all group members to complete it. It should demonstrate that you’ve learned some of the key topics in this course, like how to use a database or 3rd party APIs, or use a technology called [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) which allows real-time, bi-directional communication between clients and servers.

A good example of a sufficiently large past project is this one: Recipe site, can search recipe API and favorite recipes, can make local tweaks or upload own recipes, can share recipes publicly or with select group of friends

Some caveats/restrictions:
- If you choose a multiplayer game project, you must have no more than 3 people in your group. Experience has taught me that there’s not enough work for more than 3 people, since the WebSockets server code tends to bottleneck the group for at least a few weeks.
- No todo apps or calendar apps. They’re boring and there’s too much sample code for them on the internet.
- If you’re using an API, make sure that API you choose has a free tier with enough data that isn’t too rate-limited (unless you’re willing to pay). Stock APIs in particular tend to be more expensive and have a more restrictive free tier, so research carefully before you commit.
- If your project uses API(s), you need to do something more than just display the API’s information in a nice format and/or let the users search for specific information — your project can’t just be a front-end for the API, as this won’t be enough work. A good example of an API project with enough work is a travel planner: you need to integrate multiple APIs (flights, hotels, etc.), present options to the user for comparison based on their search queries, and allow the user to save which options they’d like to make a complete trip plan. A project that only allowed the user to search a list of flights and/or hotels wouldn’t be sufficient.
- Recommendation engines are usually not a good core feature. They can make a nice add-on feature, but the problem is that to make a good recommendation engine, you typically need to train a machine learning model on a large dataset, which is difficult to acquire and out of scope for this course.

This is not a course on visual design, but all projects should have at least a little polish in their look and feel; the site shouldn’t look like a barebones browser-default Times New Roman text site. You can write CSS yourself or use UX libraries like Bootstrap or Material Design to achieve this.

All group members are required to write JS (not just HTML/CSS) for the project. A group member cannot only be in charge of visual design. Each week, you’ll submit a progress report and I’ll look over your commit history to verify you’re on track and contributing equally.

## Deliverables
- Week 5: Project proposal due before the second class, will discuss in class and create a contract
- Weeks 6-10: Weekly progress reports, summarize what was achieved last week and what the plan is for the next week for each group member
- Weeks 6-10: In-person weekly check-ins, all group members are required to pick a class day they all attend to check-in with their instructor about the project
- Finals week: Live demos during the final exam time slot, final project report/contract review, individual reflections

## Grading
All assignments will be submitted as a group except the individual reflection and proposals.

| Assignment            | Points                                       |
|-----------------------|----------------------------------------------|
| Proposal and contract  | 1 point                                     |
| Progress reports      | 20 points (5 reports * 4 points each)       |
| Check-ins             | 20 points (5 check-ins * 4 points each)     |
| Demo                  | 4 points                                    |
| Contract review       | 50 points                                   |
| Individual reflection | 5 points                                    |

- Week 5: Choose your group members and discuss project ideas. Submit proposal.
- Weeks 6 - 10: Submit a progress report showing what work each group member has done that week, with links to the commits each person made. In-person check-ins.
- Finals week: Submit your contract review and individual reflections. We’ll have groups demo their projects live in a final exam time slot, and then we’ll vote on the best project.
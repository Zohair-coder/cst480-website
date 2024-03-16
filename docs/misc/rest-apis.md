---
title: REST APIs
sidebar_position: 1
---

Most web apps are essentially interfaces to a database. eCommerce sites store products and orders, forum sites store posts and comments, etc. Exposing a database directly to the internet is insecure as anyone could delete, read, and modify any piece of data. Instead, we can hide the database behind a web API that exposes the data in a safe, query-able way. Since we communicate with web APIs using HTTP requests, we can structure our API to perform different actions on different resources depending on the kind of request.

> Web apps that mainly serve as a database interface are sometimes called CRUD apps — this stands for Create, Read, Update, Delete, which are the main operations performed on data.

There are many ways you can structure an API. One of the most popular architectures is REST, which stands for REpresentation State Transfer. REST has some common conventions that make designing a web interface to a database easier. Since many APIs are REST-ful, using a REST-ful interface will make your interface familiar to other web developers.

REST APIs tend to follow these conventions:

- The HTTP method denotes what kind of action should be performed on what resource. Resources are units of data — typically, something that’s a single row in a database table. POST requests create a resource, GET requests get resources, PUT requests update resources, and DELETE requests delete resources.
- Each resource type is given a route (e.g. `/users`) and each resource is given a unique ID. When sending a request, you can specify the ID in the route, but if you don’t, the HTTP method’s action might be performed on all resources of that type. For example, `GET /users` would get all users and `GET /users/12345` would get the user information associated with user ID 12345. You might require IDs for actions like DELETE to avoid someone deleting an entire database table by accident.
- Some actions might support filtering with query strings. For example, `GET /orders?date=2015-01-13` could get all orders that occurred on the date 13 January 2015.
- Actions that send data, like POST and PUT, should include that data in their response bodies. Many REST APIs use JSON.
- The response status code should say something about the action. Generally, 200 means the action succeeded, 400 means the action failed because the user-supplied data was invalid (e.g. `POST /recipes {"num_ingredients": "ABC"}` has a string instead of a number and should receive a 400 response), 404 means the resource didn’t exist, and 500 means the server crashed when trying to fulfill the request.

When designing an API, you have to think about how you want to structure it, what methods you want to support, and what restrictions you’ll encode. 

I expect your API to follow the above basic best practices. You can implement additional functionality if you want (see below).

## Further reading

You don’t need to follow all of the practices outlined in these articles, but they may give you some ideas on how to structure your API:

- Quick tips on designing REST APIs ([link](https://www.restapitutorial.com/lessons/restquicktips.html))
- HTTP status codes overview ([link](https://www.mscharhag.com/api-design/http-status-codes))
- See the pages under “Basic CRUD apps” for an overview of how most POST, GET, PUT, and DELETE requests should behave ([link](https://www.mscharhag.com/p/rest-api-design))
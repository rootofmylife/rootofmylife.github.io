# More

`global` Think of this as like `window` but for Node.js. DON'T ABUSE IT!

`__dirname` This global is a `String` value that points the the directory name of the file it's used in.

`__filename` Like `__dirname`, it too is relative to the file it's written in. A `String` value that points the the file name.

`process` A swiss army knife global. An `Object` that contains all the context you need about the current program being executed. Things from env vars, to what machine you're on.

`exports` `module` `require` These globals are used for creating and exposing modules throughout your app.

## Modules

### Two module types

By default, Node.js uses common js modules. With newer versions of Node.js we can now take advantage of ES6 modules. To opt into using this syntax (ES6 modules), you can use the `.mjs` extension instead of `.js`. We'll be using the ES6 module syntax going forward as they are the standard now with browsers adding support now.

### Module syntax

```javascript
// utils.mjs
export const action = () => {};

export const run = () => {};
```

```javascript
// app.mjs

import { action, run } from "./utils";
```

Few things happening here. Let's look at the `utils.js` file. Here we're using the `export` keyword before the variable declartion. This creates a named export. With the name being whatever the variable name is. In this case, a function called `action`. Now in `app.js`, we import the action module from the utils file. The path to the file is relative to the file you're importing from. You also have to prefix your path with a `'./'`. If you don't, Node will think you're trying to import a built in module or npm module. Because this was a named export, we have to import with brackets `{ action, run }` with the exact name of the modules exported. We don't have to import every module that is exported.

Usually if you only have to expose one bit of code, you should use the `default` keyword. This allows you to import the module with whatever name you want.

```javascript
// utils.js
default export function () {
  console.log('did action')
}
```

```javascript
// app.js
import whateverIWant from "./utils";
```

### Internal Modules

Node.js comes with some great internal modules. You can think of them as like the phenonminal global APIs in the browser. Here are some of the most useful ones:

- `fs` - useful for interacting with the file system.
- `path` - lib to assit with manipulating file paths and all their nuiances.
- `child_process` - spawn subprocesses in the background.
- `http` - interact with OS level networking. Useful for creating servers.

## File System

Until Node.js, there wasn't a great way to access the file system on a machine with JavaScript, this is due to secutrity restrictions in most browsers. With Node.js, one can create, edit, remote, read, stream, & more with files. If you've ever used a build tool like webpack or a parser like babel, then you realize just how powerful Node.js can be when manipulating the file system.

## Reading a file

Create a simple html file `template.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <h1>{title}</h1>
    <p>{body}</p>
  </body>
</html>
```

This html file will be used as template and has placeholders that we will interpolate later when writing a file.

To read the file:

```javascript
import { readFile } from "fs/promises";

let template = await readFile(
  new URL("./template.html", import.meta.url),
  "utf-8"
);
```

The `fs` module has import for promise based methods. We'll opt to use those as they have a cleaner API and using async + non-blocking methods are preferred. More on that later. Because we're using `.mjs` files, we don't have access to `__dirname` or `__filename` which is what is normally used in combination with the path module to form an appropiate file path for `fs`. So we have to use the `URL` global that takes a relative path and a base path and will create a `URL` object that is accepted by `readFile`. If you were to log template, you'd see that its just a string.

## Write a file

Writing a file is similar to reading a file, except you need some content to place in the file. Let's interpolate the variables inside our template string and write the final html string back to disk.

```javascript
import { readFile, writeFile } from "fs/promises";

let template = await readFile(new URL("./test.html", import.meta.url), "utf-8");

const data = {
  title: "My new file",
  body: "I wrote this file to disk using node",
};

for (const [key, val] of Object.entries(data)) {
  template = template.replace(`{${key}}`, val);
}

await writeFile(new URL("./index.html", import.meta.url), template);
```

## Error Handling

### Process exiting

When a exception is thrown in Node.js, the current process will exit with a code of `1`. This effectively errors out and stops your programing completely. You can manually do this with:

`process.exit(1)`

Although you shouldn't. This is low level and offers no chance to catch or handle an exception to decide on what to do. Imagine your entire API shutting down and restarting just because a user sent a malformed payload that resulting the DB throwing and exception. That would be terrible.

### Async Errors

When dealing with callbacks that are used for async operations, the standard pattern is:

```javascript
fs.readFile(filePath, (error, result) => {
  if (error) {
    // do something
  } else {
    // yaaay
  }
});
```

Callbacks accept the `(error, result)` argument signature where error could be `null` if there is no error.

For `promises`, you can continue to use the `.catch()` pattern. Nothing new to see here.

For `async / await` you should use `try / catch`.

```javascript
try {
  const result = await asyncAction();
} catch (e) {
  // handle error
}
```

### Sync Errors

For sync errors, `try / catch` works just fine, just like with async await.

```javascript
try {
  const result = syncAction();
} catch (e) {
  // handle error
}
```

### Catch All

Finally, if you just can't catch those pesky errors for any reason. Maybe some lib is throwing them and you can't catch them. You can use (put this code at the top of your file):

```javascript
process.on("uncaughtException", (error) => {
  // handle error
});

// process.on('uncaughtException', cb)
```

## Packages

### NPM

#### Init

To consume a package, we must first turn our app into a package. We can do this with a simple file called `package.json` on the root of our app. Writing it by hand is cool, but using a CLI called `npm` is better. NPM was already installed when you installed Node.js. In a new folder, run: `npm init`

This will initialze a new package by walking you through a few prompts. Once you're finished, you'll have a `package.json` file that looks like this:

```json
{
  "name": "app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

### Commands

- `npm install` - installs given module(s) from remote registries or local sources
- `npm test` - runs the test script in your package.json
- `npm uninstall` - will uninstall a give package

## CLI

### Creating a CLI

Creating a CLI in Node.js just takes a extra step or two because they are really just an ordinary Node.js app wrapped behind a bin command. For this exercise, we'll create a CLI that opens a random reddit post in our browser. To start, we'll create a new folder and make it a package with npm init.

Once inside that folder, create a file reddit.mjs:

```javascript
// reddit.mjs
#! /usr/bin/env node

console.log('hello from your CLI')
```

The fist line on that file is called a shabang or hashbang. It's needed to tell the machine where the interpreter is located that is needed to execute this file. For us, that will be Node.js.

Next we need to tell Node.js what the name of our CLI is so when can actually use it in our terminal. Just have to add a section to our package.json:

```json
"bin": {
  "reddit": "./reddit.mjs"
}
```

Once installed, this package will have it's bin command installed into your machine's bin folder allowing us to use the `reddit` command.

Lastly, we must install our own package locally so we can test out the CLI. We could just execute the file with the node runtime, but we want to see the CLI actually work.

```bash
npm install -g
```

We can simply instll with no args which tells `npm` to install the current director. The `-g` flag means we want to globally install this package vs in a local node_modules.

You should now be able to run `reddit` and see your log print.

### Packages in our Pacakge

Now to realize our dream of our reddit CLI opening a random reddit post, we have some work to do. Luckily for us, we can use NPM to install some packages to help.

```bash
npm install open node-fetch yargs --save
```

We'll install just these three packages.

- `open` - will open our browser with a URL
- `node-fetch` - is a fetch client that we can use to hit the reddit API
- `yargs` - will allow us to process any flags or arguments passed to the CLI

So to put it all together

```javascript
#! /usr/bin/env node
// import our packages
import open from "open";
import fetch from "node-fetch";
import yargs from "yargs";

// parse env vars
const { argv } = yargs(process.argv);
// init fetch to reddit api
const res = await fetch("https://www.reddit.com/.json");
const data = await res.json();
const randomIndex = Math.floor(Math.random() * data.data.children.length);
// get radom post from reddit api response of all posts on front page
const post = data.data.children[randomIndex];

// log if --print flag is passed
if (argv.print) {
  console.log(`
    Title: ${post.data.title}\n
    Link: ${post.data.permalink}
  `);
} else {
  // open in browser if not
  open(`https://reddit.com${post.data.permalink}`);
}
```

With just a few lines of JS we were able to create a really powerful CLI with room for improvement. Like adding more options via flags. Even adding sub commands.

## Servers

### The hard way

Node.js ships with the `http` module. This module is an abstraction around OS level networking tools. For Node.js, the http module would be considered "low level". Let's create a simple server.

```javascript
import http from "http";

const host = "localhost";
const port = 8000;

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (req.headers["content-type"] === "application/json") {
        body = JSON.parse(body);
      }

      console.log(body);
      res.writeHead(201);
      res.end("ok");
    });
  } else {
    res.writeHead(200);
    res.end("hello from my server");
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
```

Using the createServer method on the http module, we create a server. Before we start the server, we need to make sure it can handle incoming requests. That's the callback inside of createServer. Next is starting the server. To do that, we need a port and a host. Sites default to port 8080 or 8000 so it's not uncommon to use that when developing locally. The host is going to be your machine, which is localhost or 127.0.0.1.

Using the http module is fine for this small example, but for bulding real world APIs we should utilize the community and install some packages to help up with this task.

### Express

There is an awesome packaged, express, that makes creating servers in Node.js a breeze. We're going to use it now.

```bash
npm install express body-parser morgan
```

- `express` - a framework for building servers
- `body-parser` - a middleware that parses incoming requests
- `morgan` = a middleware for logging incoming requests

With everything installed, we'll create a simple API for a todo app using express.

```js
import express from "express";
import morgan from "morgan";
import bp from "body-parser";

const { urlencoded, json } = bp;

const db = {
  todos: [],
};

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan("dev"));

app.get("/todo", (req, res) => {
  res.json({ data: db.todos });
});

app.post("/todo", (req, res) => {
  const newTodo = { complete: false, id: Date.now(), text: req.body.text };
  db.todos.push(newTodo);

  res.json({ data: newTodo });
});

app.listen(8000, () => {
  console.log("Server on http://localhost:8000");
});
```

Our todo API has two routes:

```output
GET /todo - get all todos
POST /todo - create a new todo
```

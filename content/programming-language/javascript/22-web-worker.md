# Web Worker

Web Workers are in-browser **threads** that can be used to execute JavaScript code without blocking the event loop.

This is truly amazing. The whole paradigm of JavaScript is based on the idea of single-threaded environment but here come Web Workers which remove (partially) this limitation.

Web Workers allow developers to put long-running and computationally intensive tasks on the background without blocking the UI, making your app even more responsive. What’s more, no tricks with the `setTimeout` are needed in order to hack your way around the event loop.

## Overview of Web Workers

Web Workers allow you to do things like firing up long-running scripts to handle computationally intensive tasks, but without blocking the UI. In fact, it all takes place in parallel . Web Workers are truly multi-threaded.

You might say — “Wasn’t JavaScript a single-threaded language?”.

This should be your ‘aha!’ moment when you realize that JavaScript is a language, which doesn’t define a threading model. ==Web Workers are not part of JavaScript, they’re a browser feature which can be accessed through JavaScript.== Most browsers have historically been single-threaded (this has, of course, changed), and most JavaScript implementations happen in the browser. Web Workers are not implemented in Node.JS — it has a concept of “cluster” or “child_process” which is a bit different.

Three types of Web Workers:

- [Dedicated Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [Shared Workers](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)
- [Service workers](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker_API)

## Dedicated Workers

Dedicated Web Workers are instantiated by the main process and can only communicate with it.

## Shared Workers

Shared workers can be reached by all processes running on the same origin (different browser tabs, iframes or other shared workers).

## Service Workers

A Service Worker is an event-driven worker registered against an origin and a path. It can control the web page/site it is associated with, intercepting and modifying the navigation and resource requests, and caching resources in a very granular fashion to give you great control over how your app behaves in certain situations (e.g. when the network is not available.)

In this post, we’ll focus on Dedicated Workers and refer to them as “Web Workers” or “Workers”.

## How Web Workers work

Web Workers are implemented as `.js` files which are included via asynchronous HTTP requests in your page.

Workers utilize thread-like message passing to achieve parallelism. They’re perfect for keeping your UI up-to-date, performant, and responsive for users.

Web Workers run in an isolated thread in the browser. As a result, the code that they execute needs to be contained in a **separate file**. That’s very important to remember.

Let’s see how a basic worker is created:

```js
var worker = new Worker("task.js");
```

If the “task.js” file exists and is accessible, the browser will spawn a new thread which downloads the file asynchronously. Right after the download is completed, it will be executed and the worker will begin.

In case the provided path to the file returns a 404, the worker will fail silently.

In order to start the created worker, you need to invoke the `postMessage` method:

```js
worker.postMessage();
```

## Web Worker communication

In order to communicate between a Web Worker and the page that created it, you need to use the `postMessage` method or a [Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel).

## The postMessage method

Newer browsers support a `JSON` object as a first parameter to the method while older browsers support just a `string`.

Let’s see an example of how the page that creates a worker can communicate back and forth with it, by passing a JSON object as a more “complicated” example. Passing a string is quite the same.

Let’s take a look at the following HTML page (or part of it to be more precise):

```js
<button onclick="startComputation()">Start computation</button>

<script>
  function startComputation() {
    worker.postMessage({'cmd': 'average', 'data': [1, 2, 3, 4]});
  }

  var worker = new Worker('doWork.js');

  worker.addEventListener('message', function(e) {
    console.log(e.data);
  }, false);

</script>
```

And this is how our worker script will look like:

```js
self.addEventListener(
  "message",
  function (e) {
    var data = e.data;
    switch (data.cmd) {
      case "average":
        var result = calculateAverage(data); // Some function that calculates the average from the numeric array.
        self.postMessage(result);
        break;
      default:
        self.postMessage("Unknown command");
    }
  },
  false
);
```

When the button is clicked, `postMessage` will be called from the main page. The `worker.postMessage` line passes the `JSON` object to the worker, adding `cmd` and `data` keys with their respective values. The worker will handle that message through the defined `message` handler.

When the message arrives, the actual computing is being performed in the worker, without blocking the event loop. The worker is checking the passed event `e` and executes just like a standard JavaScript function. When it’s done, the result is passed back to the main page.

In the context of a worker, both the `self` and `this` reference the global scope for the worker.

> There are two ways to stop a worker: by calling `worker.terminate()` from the main page or by calling `self.close()` inside of the worker itself.

## Broadcast Channel

The [Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) is a more general API for communication. It lets us broadcast messages to all contexts sharing the same origin. All browser tabs, iframes, or workers served from the same origin can emit and receive messages:

```js
// Connection to a broadcast channel
var bc = new BroadcastChannel("test_channel");

// Example of sending of a simple message
bc.postMessage("This is a test message.");

// Example of a simple event handler that only
// logs the message to the console
bc.onmessage = function (e) {
  console.log(e.data);
};

// Disconnect the channel
bc.close();
```

## The size of messages

There are 2 ways to send messages to Web Workers:

- **Copying the message:** the message is serialized, copied, sent over, and then de-serialized at the other end. The page and worker do not share the same instance, so the end result is that a duplicate is created on each pass. Most browsers implement this feature by automatically JSON encoding/decoding the value at either end. As expected, these data operations add significant overhead to the message transmission. The bigger the message, the longer it takes to be sent.
- **Transferring the message:** this means that the original sender can no longer use it once sent. Transferring data is almost instantaneous. The limitation is that only [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) is transferable.

## Features available to Web Workers

Web Workers have access **only to a subset** of JavaScript features due to their multi-threaded nature. Here’s the list of features:

- The `navigator` object
- The `location` object (read-only)
- `XMLHttpRequest`
- `setTimeout()/clearTimeout()` and `setInterval()/clearInterval()`
- The [Application Cache](https://www.html5rocks.com/tutorials/appcache/beginner/)
- Importing external scripts using `importScripts()`
- [Creating other web workers](https://www.html5rocks.com/en/tutorials/workers/basics/#toc-enviornment-subworkers)

## Web Worker limitations

Sadly, Web Workers don’t have access to some very crucial JavaScript features:

- The DOM (it’s not thread-safe)
- The `window` object
- The `document` object
- The `parent` object

This means that a Web Worker can’t manipulate the DOM (and thus the UI). It can be tricky at times, but once you learn how to properly use Web Workers, you’ll start using them as separate “computing machines” while all the UI changes will take place in your page code. The Workers will do all the heavy lifting for you and once the jobs are done, you’ll pass the results to the page which makes the necessary changes to the UI.

## Handling errors

As with any JavaScript code, you’ll want to handle any errors that are thrown in your Web Workers. If an error occurs while a worker is executing, the `ErrorEvent` is fired. The interface contains three useful properties for figuring out what went wrong:

- **filename** - the name of the worker script that caused the error
- **lineno** - the line number where the error occurred
- **message** - a description of the error

This is an example:

`handlingWebWorkerError.js`

```js
function onError(e) {
  console.log("Line: " + e.lineno);
  console.log("In: " + e.filename);
  console.log("Message: " + e.message);
}

var worker = new Worker("workerWithError.js");
worker.addEventListener("error", onError, false);
worker.postMessage(); // Start worker without a message.
```

`workerWithError.js`

```js
self.addEventListener('message', function(e) {
  postMessage(x * 2); // Intentional error. 'x' is not defined.
};
```

Here, you can see that we created a worker and started listening for the `error` event.

Inside the worker (in `workerWithError.js`) we create an intentional exception by multiplying `x` by 2 while `x` is not defined in that scope. The exception is propagated to the initial script and `onError` is being invoked with information about the error.

## Service Worker

### Lifecycle of a Service Worker

The lifecycle of a service worker is completely separated from your web page one. It consists of the following phases:

- Download
- Installation
- Activation

### Download

This is when the browser downloads the `.js` file which contains the Service Worker.

### Installation

To install a Service Worker for your web app, you have to register it first, which you can do in your JavaScript code. When a Service Worker is registered, it prompts the browser to start a Service Worker install step in the background.

By registering the Service Worker, you tell the browser where your Service Worker JavaScript file lives.

```js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").then(
      function (registration) {
        // Registration was successful
        console.log("ServiceWorker registration successful");
      },
      function (err) {
        // Registration failed
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
```

The code checks whether the Service Worker API is supported in the current environment. If it is, the `/sw.js` Service Worker is registered.

You can call the `register()` method every time a page loads with no concern — the browser will figure out if the service worker has already been registered, and will handle it properly.

An important detail of the `register()` method is the location of the service worker file. In this case you can see that the service worker file is at the root of the domain. This means that the service worker's scope will be the entire origin. In other words, this service worker will receive `fetch` events (which we’ll discuss later) for everything on this domain. If we register the service worker file at `/example/sw.js`, then the service worker would only see `fetch` events for pages which URLs start with `/example/` (i.e. `/example/page1/`, `/example/page2/`).

During the installation phase, it’s best to load and cache some static assets. Once the assets are successfully cached, the Service Worker installation is complete. If not (the loading fails) — the Service Worker will do a retry. Once installed successfully, you’ll know that the static assets are in the cache.

This answers your question if registration need to happen after the load event. It’s not a must, but it’s definitely recommended.

Why so? Let’s consider a user’s first visit to your web app. There’s no service worker yet, and the browser has no way of knowing in advance whether there will be a service worker that will eventually be installed. If the Service Worker gets installed, the browser will need to spend extra CPU and memory for this additional thread which otherwise the browser will spend on rendering the web page instead.

The bottom line is that , if you just install a Service Worker on your page, you’re running the risk of delaying the loading and rendering — not making the page available to your users as quickly as possible.

Note that this is important only for the first page visit. Subsequent page visits don’t get impacted by the Service Worker installation. Once a Service Worker is activated on a first page visit, it can handle loading/caching events for subsequent visits to your web app. This all makes sense, because it needs to be ready to handle limited network connectivity.

## Activation

After the Service Worker is installed, the next step will be its activation. This step is a great opportunity to manage previous caches.

Once activated, the Service Worker will start controlling all pages that fall under its scope. An interesting fact: the page that registered the Service Worker for the first time won’t be controlled until that page is loaded again. Once the Service Worker is in control, it will be in one of the following states:

- It will handle fetch and message events that occur when a network request or message is made from the page
- It will be terminated to save memory

## Handling the installation inside the Service Worker

After a page spins up the registration process, let’s see what happens inside the Service Worker script, which handles the `install` event by adding an event listener to the Service Worker instance.

Those are the steps that need to be taken when the `install` event is handled:

- Open a cache
- Cache our files
- Confirm whether all of the required assets are cached

Here is what a simple installation might look like inside a Service Worker:

```js
var CACHE_NAME = "my-web-app-cache";
var urlsToCache = [
  "/",
  "/styles/main.css",
  "/scripts/app.js",
  "/scripts/lib.js",
];

self.addEventListener("install", function (event) {
  // event.waitUntil takes a promise to know how
  // long the installation takes, and whether it
  // succeeded or not.
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});
```

If all the files are successfully cached, then the service worker will be installed. If **any** of the files fail to download, then the install step will fail. So be careful what files you put there.

Handling the `install` event is completely optional and you can avoid it, in which case you don’t need to perform any of the steps here.

## Caching requests during runtime

This part is the real-deal. This is where you’ll see how to intercept requests and return the created caches (and create new ones).

After a Service Worker is installed and the user navigates to another page or refreshes the page he’s on, the Service Worker will receive fetch events. Here is an example that demonstrates how to return cached assets or perform a new request and then cache the result:

```js
self.addEventListener("fetch", function (event) {
  event.respondWith(
    // This method looks at the request and
    // finds any cached results from any of the
    // caches that the Service Worker has created.
    caches.match(event.request).then(function (response) {
      // If a cache is hit, we can return thre response.
      if (response) {
        return response;
      }

      // Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the request.
      var fetchRequest = event.request.clone();

      // A cache hasn't been hit so we need to perform a fetch,
      // which makes a network request and returns the data if
      // anything can be retrieved from the network.
      return fetch(fetchRequest).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Cloning the response since it's a stream as well.
        // Because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          // Add the request to the cache for future queries.
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
```

Here is what happens in a nutshell:

- The `event.respondWith()` will determine how we’ll respond to the `fetch` event. We pass a promise from `caches.match()` which looks at the request and finds if there are any cached results from any of the caches that have been created.
- If there is a cache, the response is retrieved.
- Otherwise, a `fetch` will be performed.
- Check if the status is `200`. We also check that the response type is **basic,** which indicates that it’s a request from our origin. Requests to third party assets won’t be cached in this case.
- The response is added to the cache.

Requests and responses have to be cloned because they’re streams. The body of a stream can be consumed only once. And since we want to consume them, we want to clone them because the browser has to consume them as well.

## Updating a Service Worker

When a user visits your web app, the browser tries to re-download the `.js` file that contains your Service Worker code. This takes place in the background.

If there is even a single byte difference in the Service Worker’s file that was downloaded now compared to the current Service Worker’s file, the browser will assume that there is a change and a new Service Worker has to be started.

The new Service Worker will be started and the install event will be fired. At this point, however, the old Service Worker is still controlling the pages of your web app which means that the new Service Worker will enter a `waiting` state.

Once the currently opened pages of your web app are closed, the old Service Worker will be killed by the browser and the newly-installed Service Worker will take full control. This is when its activate event will be fired.

Why is all this needed? To avoid the problem of having two versions of a web app running simultaneously , in different tabs — something that is actually very common on the web and can create really bad bugs (e.g. cases in which you have different schema while storing data locally in the browser).

## Deleting data from the cache

The most common step in the `activate` callback is cache management. You’d want to do this now because if you were to wipe out any old caches in the install step, old Service Workers will suddenly stop being able to serve files from that cache.

Here is an example how you can delete some files from the cache that are not whitelisted (in this case, having `page-1` or `page-2` under their names):

```js
self.addEventListener("activate", function (event) {
  var cacheWhitelist = ["page-1", "page-2"];

  event.waitUntil(
    // Retrieving all the keys from the cache.
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        // Looping through all the cached files.
        cacheNames.map(function (cacheName) {
          // If the file in the cache is not in the whitelist
          // it should be deleted.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

## HTTPS requirement

When you’re building your web app, you’ll be able to use Service Workers through localhost, but once you deploy it in production, you need to have HTTPS ready (and that’s the last reason for you to have HTTPS).

Using a Service Worker, you can hijack connections and fabricate responses. By not using HTTPs, your web app becomes prone to a [man-in-the-middle attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

To make things safer, you’re required to register Service Workers on pages that are served over HTTPS so that you know that the Service Worker which the browser receives, hasn’t been modified while traveling through the network.

## Service Workers are opening the doors for great features

Some unique features that a Service Worker provides are:

- **Push notifications** — allow users to opt-in to timely updates from web apps.
- **Background sync** — allows you to defer actions until the user has stable connectivity. This way, you can make sure that whatever the user wants to send, is actually sent.
- **Periodic sync** (future) — API that provides functionality for managing periodic background synchronization.
- **Geofencing** (future) — you can define parameters, also referred to as **geofences** which surround the areas of interest. The web app gets a notification when the device crosses a geofence, which allows you to provide useful experience based on the geography of the user.

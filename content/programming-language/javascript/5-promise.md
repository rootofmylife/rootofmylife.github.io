# Promise

## The Bad Old Days: Callback Functions

Before we had JavaScript promises, the preferred way of dealing with an asynchronous operation was to use a callback. A callback is a function that’s run when the result of the asynchronous operation is ready. For example:

```javascript
setTimeout(function () {
  console.log("Hello, World!");
}, 1000);
```

Here, `setTimeout` is an asynchronous function that runs whichever callback function it’s passed after a specified number of milliseconds. In this case, it logs “Hello, World!” to the console after one second has passed.

Now imagine we wanted to log a message every second for five seconds. That would look like this:

```javascript
setTimeout(function () {
  console.log(1);
  setTimeout(function () {
    console.log(2);
    setTimeout(function () {
      console.log(3);
      setTimeout(function () {
        console.log(4);
        setTimeout(function () {
          console.log(5);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
```

Asynchronous JavaScript that uses multiple nested callbacks in this way is both error prone and hard to maintain. It’s often referred to as [**callback hell**](https://www.sitepoint.com/saved-from-callback-hell/), and even has [its own web page](http://callbackhell.com/).

## Back to 70s

Promises aren’t all that new. Like _most things in computer science_, the earliest mention of Promises can be traced all the way back to the [late seventies](https://en.wikipedia.org/wiki/Futures_and_promises). According to the _Internet_, they made their first appearance in JavaScript in 2007 – in a library called `MochiKit`. Then `Dojo` adopted it, and `jQuery` followed shortly after that.

Then the [Promises/A+](https://promisesaplus.com/) specification came out from the CommonJS group _(now famous for their CommonJS module specification)_. In its earliest incarnations, Node.js shipped with promises. Some time later, they were removed from core and everyone switched over to callbacks. Now, promises ship with the ES6 standard and V8 has already implemented them a while back.

> The ES6 standard implements **Promises/A+** natively. In the latest versions of Node.js you can use promises without any libraries. They’re also available on Chrome 32+, Firefox 29+, and Safari 7.1+.

## What is Promise?

The ECMA Committee defines a promise as —

> ==A Promise is an object that is used as a placeholder for the eventual results of a deferred (and possibly asynchronous) computation.==

A promise is an object that may produce a single value some time in the future with either a resolved value or a reason that it’s not resolved(for example, network error). It will be in one of the 3 possible states: fulfilled, rejected, or pending.

Promises help us avoid what's commonly referred to as "callback hell", wherein cascading callbacks create a pyramid shape and impossible to decipher code that's hard to scale. Promises allow us to easily chain callbacks in an intuitive way, by chaining `then` and using `catch` for errors. Promises helps to break up callbacks into methods with semantic naming.

==In callback queue, Promise will be in micro-queue, so it won't be called until all tasks in macro-queue are done==

The syntax of Promise creation looks like below,

```js
const promise = new Promise(function (resolve, reject) {
  // promise description
});
```

We start by instantiating a new promise object using the `Promise` constructor and passing it a callback function. The callback takes two arguments, `resolve` and `reject`, which are both functions. All of our asynchronous code goes inside that callback.

If everything runs successfully, the promise is fulfilled by calling `resolve`. In case of an error, the promise is rejected by calling `reject`. We can pass values to both methods which will then be available in the consuming code.

The usage of a promise would be as below,

```js
const promise = new Promise(
  (resolve) => {
    setTimeout(() => {
      resolve("I'm a Promise!");
    }, 5000);
  },
  (reject) => {}
);

promise.then((value) => console.log(value));
```

Promises are used to handle asynchronous operations. They provide an alternative approach for callbacks by reducing the callback hell and writing the cleaner code.

Promises have three states:

1. **Pending:** This is an initial state of the Promise before an operation begins
2. **Fulfilled:** This state indicates that the specified operation was completed.
3. **Rejected:** This state indicates that the operation did not complete. In this case an error value will be thrown.

### The Promise Constructor

We start off by using the `Promise` constructor to create a new promise object. The constructor is used to wrap functions or APIs that don’t already support promises, such as the `XMLHttpRequest` object above. The callback passed to the promise constructor contains the asynchronous code used to get data the from remote service.

When a successful response is received from the remote server, it’s passed to the `resolve` method. In case of any error happening — either on the server or at a network level — `reject` is called with an `Error` object.

So, how do we create our own functions based on promises?

```js
function serveDish() {
  return new Promise((resolve) => {
    // An asynchronous function that gives you the dish back with a callback.
    createDish(function (error, dish) {
      if (error) {
        throw error;
      }
      resolve(dish); // completed the operation and resolved the promise.
    });
  });
}
```

The constructor `new Promise` helps you create new Promises yourself. You might want to do this if you want to convert something that works by callbacks to a Promise. Or even just create one so that it executes asynchronously. If the promise runs into an error, you can just throw a `Error` and then `catch` the same at the other side.

**The other side:**

```js
serveDish()
  .then((dish) => console.log("Here's your dish", dish))
  .catch((err) => console.error("Things burned because of ", err));
```

But the real promise of `Promises` lies in the fact that you can chain them.

```js
learnCooking()
  .then((recipes) => createDish(recipes))
  .then((dish) => inviteNeighbours(dish))
  .then((dish) => serveDish(dish))
  .then((servedDish) => getFeedback(servedDish))
  .catch((err) => console.error("Something went wrong! 🔥"));
```

This is called chaining of promises, you can chain any number of promises you want as long as you return a promise from the then before. This is very easy than it seems because primitives are automatically converted to promises. If you want to convert something to promise explicitly, you can always:

```js
Promise.resolve(41);
```

So far, we saw how we can handle a single promise and chain the results from these. But what if there are different promises and you need to wait for all of them to complete before you can execute? This is where `Promise.all` comes into play.

For eg. you have made multiple dishes studying the recipes.

```js
const dishes = ["names", "of", "your", "favorite", "dishes", "go", "here"];

// map returns the promise and forms dishesPromise array
const dishesPromise = dishes.map((dish) => createDish(dish));

// You want to wait for all dishes to complete cooking before you invite neighbours
Promise.all(dishesPromise).then((dishes) => inviteNeighbours(dishes));
```

`Promise.all` takes an array of promises as arguments and the `then` on it, is executed when all of them completes. The argument to `then` callback has an array of results from all the promises.

### The `then` Method

When we instantiate a promise object, we get a proxy to the data that will be available in future. In our case, we’re expecting some data to be returned from the remote service. So, how do we know when the data becomes available? This is where the `Promise.then()` function is used:

```javascript
const promise = new Promise((resolve, reject) => { ... });

promise.then((data) => {
  console.log('Got data! Promise fulfilled.');
  document.body.textContent = JSON.parse(data).joke;
}, (error) => {
  console.error('Promise rejected.');
  console.error(error.message);
});
```

This function can take two arguments: a success callback, and a failure callback. These callbacks are called when the promise is settled (that is, either fulfilled or rejected). If the promise was fulfilled, the success callback will be fired with the actual data we passed to `resolve`. If the promise was rejected, the failure callback will be called. Whatever we passed to `reject` will be passed as an argument to this callback.

## Important Promise Rules

A standard for promises was defined by the [Promises/A+ specification](https://promisesaplus.com/implementations) community. There are many implementations which conform to the standard, including the JavaScript standard ECMAScript promises.

Promises following the spec must follow a specific set of rules:

- A promise or “thenable” is an object that supplies a standard-compliant `.then()` method.
- A pending promise may transition into a fulfilled or rejected state.
- A fulfilled or rejected promise is settled, and must not transition into any other state.
- Once a promise is settled, it must have a value (which may be `undefined`). That value must not change.

Change in this context refers to identity (`===`) comparison. An object may be used as the fulfilled value, and object properties may mutate.

Every promise must supply a `.then()` method with the following signature:

```js
promise.then(
  onFulfilled?: Function,
  onRejected?: Function
) => Promise
```

The `.then()` method must comply with these rules:

- Both `onFulfilled()` and `onRejected()` are optional.
- If the arguments supplied are not functions, they must be ignored.
- `onFulfilled()` will be called after the promise is fulfilled, with the promise’s value as the first argument.
- `onRejected()` will be called after the promise is rejected, with the reason for rejection as the first argument. The reason may be any valid JavaScript value, but because rejections are essentially synonymous with exceptions, I recommend using Error objects.
- Neither `onFulfilled()` nor `onRejected()` may be called more than once.
- `.then()` may be called many times on the same promise. In other words, a promise can be used to aggregate callbacks.
- `.then()` must return a new promise, `promise2`.
- If `onFulfilled()` or `onRejected()` return a value `x`, and `x` is a promise, `promise2` will lock in with (assume the same state and value as) `x`. Otherwise, `promise2` will be fulfilled with the value of `x`.
- If either `onFulfilled` or `onRejected` throws an exception `e`, `promise2` must be rejected with `e` as the reason.
- If `onFulfilled` is not a function and `promise1` is fulfilled, `promise2` must be fulfilled with the same value as `promise1`.
- If `onRejected` is not a function and `promise1` is rejected, `promise2` must be rejected with the same reason as `promise1`.

## Fetch API

At this point, we might be asking why we’re not using the Fetch API to fetch the data from the remote server, and the answer is that we probably should be.

Unlike the `XMLHttpRequest` object, the Fetch API is promise-based, which means we could rewrite our code like so (minus error handling):

```javascript
fetch("https://icanhazdadjoke.com", {
  headers: { Accept: "application/json" },
})
  .then((res) => res.json())
  .then((json) => console.log(json.joke));
```

The reason for using `XMLHttpRequest` was to give more of an insight into what’s going on under the hood.

If the `fetch` API used callbacks, you’d get one last parameter that then gets executed whenever fetching ends. Typical asynchronous code flow conventions dictate that we allocate the first parameter for errors _(that may or may not occur)_ during the _fetching process_. The rest of the parameters can be used to pass in resulting data. Often, a single parameter is used.

```js
fetch("foo", (err, res) => {
  if (err) {
    // handle error
  }
  // handle response
});
```

The callback wouldn’t be invoked until the `foo` resource has been fetched, so its execution remains asynchronous and non-blocking. Note that in this model you could only specify **a single callback**, and that callback would be responsible for _all functionality_ derived from the response.

Another option might have been to use an _event-driven_ API model. In this model the object returned by `fetch` would be able to listen `.on` events, binding as many event handlers as needed for any events. Typically there’s an `error` event for when things go awry and a `data` event that’s called when the operation completes successfully.

```js
fetch("foo")
  .on("error", (err) => {
    // handle error
  })
  .on("data", (res) => {
    // handle response
  });
```

In this case, errors usually end up in hard exceptions if no event listener is attached – but that depends on what event emitter implementation is used.

### What is promise chaining

The process of executing a sequence of asynchronous tasks one after another using promises is known as Promise chaining. Let's take an example of promise chaining for calculating the final result,

```js
new Promise(function (resolve, reject) {
  setTimeout(() => resolve(1), 1000);
})
  .then(function (result) {
    console.log(result); // 1
    return result * 2;
  })
  .then(function (result) {
    console.log(result); // 2
    return result * 3;
  })
  .then(function (result) {
    console.log(result); // 6
    return result * 4;
  });
```

In the above handlers, the result is passed to the chain of .then() handlers with the below work flow,

1. The initial promise resolves in 1 second,
2. After that `.then` handler is called by logging the result(1) and then return a promise with the value of result \* 2.
3. After that the value passed to the next `.then` handler by logging the result(2) and return a promise with result \* 3.
4. Finally the value passed to the last `.then` handler by logging the result(6) and return a promise with result \* 4.

Like synchronous code, chaining will result in a sequence that runs in serial. In other words, you can do:

```js
fetch(url).then(process).then(save).catch(handleErrors);
```

Assuming each of the functions, `fetch()`, `process()`, and `save()` return promises, `process()` will wait for `fetch()` to complete before starting, and `save()` will wait for `process()` to complete before starting. `handleErrors()` will only run if any of the previous promises reject.

Here’s an example of a complex promise chain with multiple rejections:

```js
const wait = (time) => new Promise((res) => setTimeout(() => res(), time));

wait(200)
  // onFulfilled() can return a new promise, `x`
  .then(() => new Promise((res) => res("foo")))
  // the next promise will assume the state of `x`
  .then((a) => a)
  // Above we returned the unwrapped value of `x`
  // so `.then()` above returns a fulfilled promise
  // with that value:
  .then((b) => console.log(b)) // 'foo'
  // Note that `null` is a valid promise value:
  .then(() => null)
  .then((c) => console.log(c)) // null
  // The following error is not reported yet:
  .then(() => {
    throw new Error("foo");
  })
  // Instead, the returned promise is rejected
  // with the error as the reason:
  .then(
    // Nothing is logged here due to the error above:
    (d) => console.log(`d: ${d}`),
    // Now we handle the error (rejection reason)
    (e) => console.log(e)
  ) // [Error: foo]
  // With the previous exception handled, we can continue:
  .then((f) => console.log(`f: ${f}`)) // f: undefined
  // The following doesn't log. e was already handled,
  // so this handler doesn't get called:
  .catch((e) => console.log(e))
  .then(() => {
    throw new Error("bar");
  })
  // When a promise is rejected, success handlers get skipped.
  // Nothing logs here because of the 'bar' exception:
  .then((g) => console.log(`g: ${g}`))
  .catch((h) => console.log(h)); // [Error: bar]
```

## Returning promises

A handler, used in `.then(handler)` may create and return a promise.

In that case further handlers wait until it settles, and then get its result.

For instance:

```javascript
new Promise(function (resolve, reject) {
  setTimeout(() => resolve(1), 1000);
})
  .then(function (result) {
    alert(result); // 1

    return new Promise((resolve, reject) => {
      // (*)
      setTimeout(() => resolve(result * 2), 1000);
    });
  })
  .then(function (result) {
    // (**)

    alert(result); // 2

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(result * 2), 1000);
    });
  })
  .then(function (result) {
    alert(result); // 4
  });
```

Here the first `.then` shows `1` and returns `new Promise(…)` in the line `(*)`. After one second it resolves, and the result (the argument of `resolve`, here it’s `result * 2`) is passed on to the handler of the second `.then`. That handler is in the line `(**)`, it shows `2` and does the same thing.

So the output is the same as in the previous example: 1 → 2 → 4, but now with 1 second delay between `alert` calls.

Returning promises allows us to build chains of asynchronous actions.

### What is promise.all

Promise.all is a promise that takes an array of promises as an input (an iterable), and it gets resolved when all the promises get resolved or any one of them gets rejected. For example, the syntax of promise.all method is below,

```js
Promise.all([Promise1, Promise2, Promise3])
        .then(result) => {
            console.log(result)
        })
        .catch(error => console.log(`Error in promises ${error}`))
```

**Note:** Remember that the order of the promises(output the result) is maintained as per input order.

### Promise.any()

`Promise.any` returns the value of the first promise to be fulfilled. If any promises are rejected, these get ignored:

```javascript
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(1), 0)),
  new Promise((resolve, reject) => setTimeout(() => resolve(2), 1500)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
])
  .then((values) => console.log(values))
  .catch((err) => console.error(err));
```

This logs “2” to the console after one and a half seconds.

### Promise.race()

`Promise.race` also receives an array of promises and (like the other methods listed above) returns a new promise. As soon as one of the promises that it receives fulfills or rejects, `race` itself will either fulfill or reject with the value or the reason from the promise which has just settled:

```javascript
Promise.race([
  new Promise((resolve, reject) =>
    setTimeout(() => reject("Rejected with 1"), 0)
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(2), 1500)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
])
  .then((values) => console.log(values))
  .catch((err) => console.error(err));
```

This will log “Rejected with 1” to the console, as the first promise in the array rejects immediately and the rejection is caught by our `catch` block.

We could change things like so:

```javascript
Promise.race([
  new Promise((resolve, reject) =>
    setTimeout(() => resolve("Resolved with 1"), 0)
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(2), 1500)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
])
  .then((values) => console.log(values))
  .catch((err) => console.error(err));
```

This will log “Resolved with 1” to the console.

In both cases, the other two promises are ignored.

### What is the purpose of the race method in promise

Promise.race() method will return the promise instance which is firstly resolved or rejected. Let's take an example of race() method where promise2 is resolved first

```js
var promise1 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 500, "one");
});
var promise2 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 100, "two");
});

Promise.race([promise1, promise2]).then(function (value) {
  console.log(value); // "two" // Both promises will resolve, but promise2 is faster
});
```

### How do you prevent promises swallowing errors

While using asynchronous code, JavaScript’s ES6 promises can make your life a lot easier without having callback pyramids and error handling on every second line. But Promises have some pitfalls and the biggest one is swallowing errors by default.

Let's say you expect to print an error to the console for all the below cases,

```js
Promise.resolve("promised value").then(function () {
  throw new Error("error");
});

Promise.reject("error value").catch(function () {
  throw new Error("error");
});

new Promise(function (resolve, reject) {
  throw new Error("error");
});
```

But there are many modern JavaScript environments that won't print any errors. You can fix this problem in different ways,

1. **Add catch block at the end of each chain:** You can add catch block to the end of each of your promise chains

   ```js
   Promise.resolve("promised value")
     .then(function () {
       throw new Error("error");
     })
     .catch(function (error) {
       console.error(error.stack);
     });
   ```

   But it is quite difficult to type for each promise chain and verbose too.

2. **Add done method:** You can replace first solution's then and catch blocks with done method

   ```js
   Promise.resolve("promised value").done(function () {
     throw new Error("error");
   });
   ```

   Let's say you want to fetch data using HTTP and later perform processing on the resulting data asynchronously. You can write `done` block as below,

   ```js
   getDataFromHttp()
     .then(function (result) {
       return processDataAsync(result);
     })
     .done(function (processed) {
       displayData(processed);
     });
   ```

   In future, if the processing library API changed to synchronous then you can remove `done` block as below,

   ```js
   getDataFromHttp().then(function (result) {
     return displayData(processDataAsync(result));
   });
   ```

   and then you forgot to add `done` block to `then` block leads to silent errors.

3. **Extend ES6 Promises by Bluebird:** Bluebird extends the ES6 Promises API to avoid the issue in the second solution. This library has a “default” onRejection handler which will print all errors from rejected Promises to stderr. After installation, you can process unhandled rejections

   ```js
   Promise.onPossiblyUnhandledRejection(function (error) {
     throw error;
   });
   ```

   and discard a rejection, just handle it with an empty catch

   ```js
   Promise.reject("error value").catch(function () {});
   ```

### What is the easiest way to ignore promise errors?

The easiest and safest way to ignore promise errors is void that error. This approach is ESLint friendly too.

```js
await promise.catch((e) => void e);
```

## Error Handling

Note that promises have both a success and an error handler, and it’s very common to see code that does this:

```js
save().then(handleSuccess, handleError);
```

But what happens if `handleSuccess()` throws an error? The promise returned from `.then()` will be rejected, but there’s nothing there to catch the rejection — meaning that an error in your app gets swallowed. Oops!

For that reason, some people consider the code above to be an anti-pattern, and recommend the following, instead:

```js
save().then(handleSuccess).catch(handleError);
```

The difference is subtle, but important. In the first example, an error originating in the `save()` operation will be caught, but an error originating in the `handleSuccess()` function will be swallowed.

In the second example, `.catch()` will handle rejections from either `save()`, or `handleSuccess()`.

Of course, the `save()` error might be a networking error, whereas the `handleSuccess()` error may be because the developer forgot to handle a specific status code. What if you want to handle them differently? You could opt to handle them both:

```js
save().then(handleSuccess, handleNetworkError).catch(handleProgrammerError);
```

Whatever you prefer, I recommend ending all promise chains with a `.catch()`.

## Promise Error Handling

We have already seen that the `then` function takes two callback functions as arguments and that the second one will be called if the promise was rejected:

```javascript
promise.then((data) => {
  console.log('Got data! Promise fulfilled.');
  ...
}, (error) => {
  console.error('Promise rejected.');
  console.error(error.message);
});
```

However, specifying an error handler for each promise could get quite verbose when dealing with promise chains. Luckily, there’s a better way…

### The `catch` Method

We can also use the `catch` method, which can handle errors for us. When a promise rejects anywhere in a promise chain, control jumps to the closest rejection handler. This is very handy, as it means we can add a `catch` onto the end of the chain and have it deal with any errors that occur.

Let’s take the previous code as an example:

```javascript
fetch("https://api.github.com/repos/eslint/eslint/contributors")
  .then((res) => res.json())
  .then((json) => {
    const firstContributor = json[0].login;
    return fetch(`https://api.github.com/users/${firstContributor}`);
  })
  .then((res) => res.jsn())
  .then((json) =>
    console.log(`The top contributor to ESLint wass ${json.name}`)
  )
  .catch((error) => console.log(error));
```

Notice that, in addition to adding an error handler at the end of the code block, I’ve misspelled `res.json()` as `res.jsn` on the seventh line.

Now when we run the code, we see the following output to the screen:

```bash
TypeError: res.jsn is not a function
  <anonymous>  http://0.0.0.0:8000/index.js:7
  promise callback*  http://0.0.0.0:8000/index.js:7

index.js:9:27
```

The file that I’m working in is called `index.js`. Line 7 contains the mistake and line 9 is the `catch` block which caught the error.

## Rethrowing

As we already noticed, `.catch` at the end of the chain is similar to `try..catch`. We may have as many `.then` handlers as we want, and then use a single `.catch` at the end to handle errors in all of them.

In a regular `try..catch` we can analyze the error and maybe rethrow it if it can’t be handled. The same thing is possible for promises.

If we `throw` inside `.catch`, then the control goes to the next closest error handler. And if we handle the error and finish normally, then it continues to the next closest successful `.then` handler.

In the example below the `.catch` successfully handles the error:

```javascript
// the execution: catch -> then
new Promise((resolve, reject) => {
  throw new Error("Whoops!");
})
  .catch(function (error) {
    alert("The error is handled, continue normally");
  })
  .then(() => alert("Next successful handler runs"));
```

Here the `.catch` block finishes normally. So the next successful `.then` handler is called.

In the example below we see the other situation with `.catch`. The handler `(*)` catches the error and just can’t handle it (e.g. it only knows how to handle `URIError`), so it throws it again:

```javascript
// the execution: catch -> catch
new Promise((resolve, reject) => {
  throw new Error("Whoops!");
})
  .catch(function (error) {
    // (*)

    if (error instanceof URIError) {
      // handle it
    } else {
      alert("Can't handle such error");

      throw error; // throwing this or another error jumps to the next catch
    }
  })
  .then(function () {
    /* doesn't run here */
  })
  .catch((error) => {
    // (**)

    alert(`The unknown error has occurred: ${error}`);
    // don't return anything => execution goes the normal way
  });
```

The execution jumps from the first `.catch` `(*)` to the next one `(**)` down the chain.

## Unhandled rejections

What happens when an error is not handled? For instance, we forgot to append `.catch` to the end of the chain, like here:

```javascript
new Promise(function () {
  noSuchFunction(); // Error here (no such function)
}).then(() => {
  // successful promise handlers, one or more
}); // without .catch at the end!
```

In case of an error, the promise becomes rejected, and the execution should jump to the closest rejection handler. But there is none. So the error gets “stuck”. There’s no code to handle it.

In practice, just like with regular unhandled errors in code, it means that something has gone terribly wrong.

What happens when a regular error occurs and is not caught by `try..catch`? The script dies with a message in the console. A similar thing happens with unhandled promise rejections.

The JavaScript engine tracks such rejections and generates a global error in that case. You can see it in the console if you run the example above.

In the browser we can catch such errors using the event `unhandledrejection`:

```javascript
window.addEventListener("unhandledrejection", function (event) {
  // the event object has two special properties:
  alert(event.promise); // [object Promise] - the promise that generated the error
  alert(event.reason); // Error: Whoops! - the unhandled error object
});

new Promise(function () {
  throw new Error("Whoops!");
}); // no catch to handle the error
```

The event is the part of the [HTML standard](https://html.spec.whatwg.org/multipage/webappapis.html#unhandled-promise-rejections).

If an error occurs, and there’s no `.catch`, the `unhandledrejection` handler triggers, and gets the `event` object with the information about the error, so we can do something.

Usually such errors are unrecoverable, so our best way out is to inform the user about the problem and probably report the incident to the server.

In non-browser environments like Node.js there are other ways to track unhandled errors.

### The `finally` method

The `Promise.finally` method is run when the promise is settled — that is, either resolved or rejected. Like `catch`, it helps prevent code duplication and is quite useful for performing clean-up tasks, such as closing a database connection, or removing a loading spinner from the UI.

Just like there’s a `finally` clause in a regular `try {...} catch {...}`, there’s `finally` in promises.

The call `.finally(f)` is similar to `.then(f, f)` in the sense that `f` runs always, when the promise is settled: be it resolve or reject.

The idea of `finally` is to set up a handler for performing cleanup/finalizing after the previous operations are complete.

E.g. stopping loading indicators, closing no longer needed connections, etc.

Think of it as a party finisher. No matter was a party good or bad, how many friends were in it, we still need (or at least should) do a cleanup after it.

Here’s an example using our previous code:

```javascript
function getFirstContributor(org, repo) {
  showLoadingSpinner();
  fetch(`https://api.github.com/repos/${org}/${repo}/contributors`)
    .then((res) => res.json())
    .then((json) => {
      const firstContributor = json[0].login;
      return fetch(`https://api.github.com/users/${firstContributor}`);
    })
    .then((res) => res.json())
    .then((json) =>
      console.log(`The first contributor to ${repo} was ${json.name}`)
    )
    .catch((error) => console.log(error))
    .finally(() => hideLoadingSpinner());
}

getFirstContributor("facebook", "react");
```

It doesn’t receive any arguments and returns a promise, so that we can chain more `then`, `catch`, and `finally` calls onto its return value.

Please note that `finally(f)` isn’t exactly an alias of `then(f,f)` though.

There are important differences:

1. A `finally` handler has no arguments. In `finally` we don’t know whether the promise is successful or not. That’s all right, as our task is usually to perform “general” finalizing procedures.

   Please take a look at the example above: as you can see, the `finally` handler has no arguments, and the promise outcome is handled by the next handler.

2. A `finally` handler “passes through” the result or error to the next suitable handler.

For instance, here the result is passed through `finally` to `then`:

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => resolve("value"), 2000);
})
  .finally(() => alert("Promise ready")) // triggers first
  .then((result) => alert(result)); // <-- .then shows "value"
```

As you can see, the `value` returned by the first promise is passed through `finally` to the next `then`.

That’s very convenient, because `finally` is not meant to process a promise result. As said, it’s a place to do generic cleanup, no matter what the outcome was.

And here’s an example of an error, for us to see how it’s passed through `finally` to `catch`:

```javascript
new Promise((resolve, reject) => {
  throw new Error("error");
})
  .finally(() => alert("Promise ready")) // triggers first
  .catch((err) => alert(err)); // <-- .catch shows the error
```

A `finally` handler also shouldn’t return anything. If it does, the returned value is silently ignored.

The only exception to this rule is when a `finally` handler throws an error. Then this error goes to the next handler, instead of any previous outcome.

## Using `Promise.resolve` and `Promise.reject`

You’re not just limited to returning other promises from your `.then` and `.catch` callbacks. You could also return values, transforming what you had. The example below first creates a promise fulfilled with `[1, 2, 3]` and then has a fulfillment branch on top of that which maps thoes values into `[2, 4, 6]`. Calling `.then` on that branch of the promise will produce the doubled values.

```js
Promise.resolve([1, 2, 3])
  .then((values) => values.map((value) => value * 2))
  .then((values) => console.log(values));
// <- [2, 4, 6]
```

Note that you can do the same thing in rejection branches. An interesting fact that may catch your eye is that if a `.catch` branch goes smoothly without errors, then it will be fulfilled with the returned value. That means that if you still want to have an error for that branch, you should `throw` again. The following piece of code takes an internal error and **masks it** behind a generic _“Internal Server Error”_ message as to not leak off potentially dangerous information to its clients.

```js
Promise.reject(new Error("Database ds.214.53.4.12 connection timeout!"))
  .catch((error) => {
    throw new Error("Internal Server Error");
  })
  .catch((error) => console.info(error));
// <- Error: Internal Server Error
```

## Example

To fully understand the concept of promises, lets create an app which loads an image. If image is loaded, we will display the image, or else log an error.

First, lets create a `promise` using XMLHttpRequest (XHR).

```js
const loadImage = (url) => {
  return new Promise(function (resolve, reject) {
    //Open a new XHR
    var request = new XMLHttpRequest();
    request.open("GET", url);

    // When the request loads, check whether it was successful
    request.onload = function () {
      if (request.status === 200) {
        // If successful, resolve the promise
        resolve(request.response);
      } else {
        // Otherwise, reject the promise
        reject(
          Error(
            "An error occurred while loading image. error code:" +
              request.statusText
          )
        );
      }
    };

    request.send();
  });
};
```

Now, when the image is successfully loaded, `promise` will `resolve` with the response from XHR. Let’s go ahead and use this `promise` by calling the `loadImage` function.

```js
const embedImage = (url) => {
  loadImage(url).then(
    function (result) {
      const img = new Image();
      var imageURL = window.URL.createObjectURL(result);
      img.src = imageURL;
      document.querySelector("body").appendChild(img);
    },
    function (err) {
      console.log(err);
    }
  );
};
```

## Beware: promises can also block the event loop

Perhaps the most popular misconception about promises is the belief that promises allow the execution of "multi-threaded" JavaScript. Although the event loop gives the illusion of "parallelism", it is only that: an _illusion_. Under the hood, JavaScript is still single-threaded.

The event loop only enables the runtime to concurrently _schedule_, _orchestrate_, and _handle_ events throughout the program. Loosely speaking, these "events" indeed _occur_ in parallel, but they are still handled sequentially when the time comes.

In the following example, the promise does _not_ spawn a new thread with the given executor function. In fact, the executor function is always executed _immediately_ upon the construction of the promise, thus blocking the event loop. Once the executor function returns, top-level execution resumes. Consumption of the resolved value (through the `Promise#then` handler) is deferred until the current call stack finishes executing the remaining top-level code

```js
console.log("Before the Executor");

// Blocking the event loop...
const p1 = new Promise((resolve) => {
  // Very expensive CPU operation here...
  for (let i = 0; i < 1e9; ++i) continue;
  console.log("During the Executor");
  resolve("Resolved");
});

console.log("After the Executor");
p1.then(console.log);
console.log("End of Top-level Code");

// Result:
// 'Before the Executor'
// 'During the Executor'
// 'After the Executor'
// 'End of Top-level Code'
// 'Resolved'
```

Since promises do not automatically spawn new threads, CPU-intensive work in subsequent `Promise#then` handlers also blocks the event loop.

```js
Promise.resolve()
  //.then(...)
  //.then(...)
  .then(() => {
    for (let i = 0; i < 1e9; ++i) continue;
  });
```

## Promisification

“Promisification” is a long word for a simple transformation. It’s the conversion of a function that accepts a callback into a function that returns a promise.

Such transformations are often required in real-life, as many functions and libraries are callback-based. But promises are more convenient, so it makes sense to promisify them.

For better understanding, let’s see an example.

For instance, we have `loadScript(src, callback)`

```javascript
function loadScript(src, callback) {
  let script = document.createElement("script");
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error for ${src}`));

  document.head.append(script);
}

// usage:
// loadScript('path/script.js', (err, script) => {...})
```

The function loads a script with the given `src`, and then calls `callback(err)` in case of an error, or `callback(null, script)` in case of successful loading. That’s a widespread agreement for using callbacks, we saw it before.

Let’s promisify it.

We’ll make a new function `loadScriptPromise(src)`, that does the same (loads the script), but returns a promise instead of using callbacks.

In other words, we pass it only `src` (no `callback`) and get a promise in return, that resolves with `script` when the load is successful, and rejects with the error otherwise.

Here it is:

```javascript
let loadScriptPromise = function (src) {
  return new Promise((resolve, reject) => {
    loadScript(src, (err, script) => {
      if (err) reject(err);
      else resolve(script);
    });
  });
};

// usage:
// loadScriptPromise('path/script.js').then(...)
```

As we can see, the new function is a wrapper around the original `loadScript` function. It calls it providing its own callback that translates to promise `resolve/reject`.

Now `loadScriptPromise` fits well in promise-based code. If we like promises more than callbacks (and soon we’ll see more reasons for that), then we will use it instead.

In practice we may need to promisify more than one function, so it makes sense to use a helper.

We’ll call it `promisify(f)`: it accepts a to-promisify function `f` and returns a wrapper function.

```javascript
function promisify(f) {
  return function (...args) { // return a wrapper-function (*)
    return new Promise((resolve, reject) => {
      function callback(err, result) { // our custom callback for f (**)
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // append our custom callback to the end of f arguments

      f.call(this, ...args); // call the original function
    });
  };
}

// usage:
let loadScriptPromise = promisify(loadScript);
loadScriptPromise(...).then(...);
```

The code may look a bit complex, but it’s essentially the same that we wrote above, while promisifying `loadScript` function.

A call to `promisify(f)` returns a wrapper around `f` `(*)`. That wrapper returns a promise and forwards the call to the original `f`, tracking the result in the custom callback `(**)`.

Here, `promisify` assumes that the original function expects a callback with exactly two arguments `(err, result)`. That’s what we encounter most often. Then our custom callback is in exactly the right format, and `promisify` works great for such a case.

But what if the original `f` expects a callback with more arguments `callback(err, res1, res2, ...)`?

We can improve our helper. Let’s make a more advanced version of `promisify`.

- When called as `promisify(f)` it should work similar to the version above.
- When called as `promisify(f, true)`, it should return the promise that resolves with the array of callback results. That’s exactly for callbacks with many arguments.

```javascript
// promisify(f, true) to get array of results
function promisify(f, manyArgs = false) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...results) { // our custom callback for f
        if (err) {
          reject(err);
        } else {
          // resolve with all callback results if manyArgs is specified
          resolve(manyArgs ? results : results[0]);
        }
      }

      args.push(callback);

      f.call(this, ...args);
    });
  };
}

// usage:
f = promisify(f, true);
f(...).then(arrayOfResults => ..., err => ...);
```

As you can see it’s essentially the same as above, but `resolve` is called with only one or all arguments depending on whether `manyArgs` is truthy.

For more exotic callback formats, like those without `err` at all: `callback(result)`, we can promisify such functions manually without using the helper.

## Microtasks

Promise handlers `.then`/`.catch`/`.finally` are always asynchronous.

Even when a Promise is immediately resolved, the code on the lines _below_ `.then`/`.catch`/`.finally` will still execute before these handlers.

Here’s a demo:

```javascript
let promise = Promise.resolve();

promise.then(() => alert("promise done!"));

alert("code finished"); // this alert shows first
```

If you run it, you see `code finished` first, and then `promise done!`.

That’s strange, because the promise is definitely done from the beginning.

Why did the `.then` trigger afterwards? What’s going on?

## Microtasks queue

Asynchronous tasks need proper management. For that, the ECMA standard specifies an internal queue `PromiseJobs`, more often referred to as the “microtask queue” (V8 term).

As stated in the [specification](https://tc39.github.io/ecma262/#sec-jobs-and-job-queues):

- The queue is first-in-first-out: tasks enqueued first are run first.
- Execution of a task is initiated only when nothing else is running.

Or, to put it more simply, when a promise is ready, its `.then/catch/finally` handlers are put into the queue; they are not executed yet. When the JavaScript engine becomes free from the current code, it takes a task from the queue and executes it.

That’s why “code finished” in the example above shows first.

Promise handlers always go through this internal queue.

If there’s a chain with multiple `.then/catch/finally`, then every one of them is executed asynchronously. That is, it first gets queued, then executed when the current code is complete and previously queued handlers are finished.

**What if the order matters for us? How can we make `code finished` appear after `promise done`?**

Easy, just put it into the queue with `.then`:

```javascript
Promise.resolve()
  .then(() => alert("promise done!"))
  .then(() => alert("code finished"));
```

Now the order is as intended.

## Unhandled rejection

**An “unhandled rejection” occurs when a promise error is not handled at the end of the microtask queue.**

Normally, if we expect an error, we add `.catch` to the promise chain to handle it:

```javascript
let promise = Promise.reject(new Error("Promise Failed!"));
promise.catch((err) => alert("caught"));

// doesn't run: error handled
window.addEventListener("unhandledrejection", (event) => alert(event.reason));
```

But if we forget to add `.catch`, then, after the microtask queue is empty, the engine triggers the event:

```javascript
let promise = Promise.reject(new Error("Promise Failed!"));

// Promise Failed!
window.addEventListener("unhandledrejection", (event) => alert(event.reason));
```

What if we handle the error later? Like this:

```javascript
let promise = Promise.reject(new Error("Promise Failed!"));
setTimeout(() => promise.catch((err) => alert("caught")), 1000);

// Error: Promise Failed!
window.addEventListener("unhandledrejection", (event) => alert(event.reason));
```

Now, if we run it, we’ll see `Promise Failed!` first and then `caught`.

If we didn’t know about the microtasks queue, we could wonder: “Why did `unhandledrejection` handler run? We did catch and handle the error!”

But now we understand that `unhandledrejection` is generated when the microtask queue is complete: the engine examines promises and, if any of them is in the “rejected” state, then the event triggers.

In the example above, `.catch` added by `setTimeout` also triggers. But it does so later, after `unhandledrejection` has already occurred, so it doesn’t change anything.

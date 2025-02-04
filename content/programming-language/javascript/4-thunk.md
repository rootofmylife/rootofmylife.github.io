# Thunk

A thunk is just a function which delays the evaluation of the value. It doesn’t take any arguments but gives the value whenever you invoke the thunk. i.e, It is used not to execute now but it will be sometime in the future. Let's take a synchronous example,

```js
const add = (x, y) => x + y;

const thunk = () => add(2, 3);

thunk(); // 5
```

The asynchronous thunks are useful to make network requests. Let's see an example of network requests,

```js
function fetchData(fn) {
  fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then((response) => response.json())
    .then((json) => fn(json));
}

const asyncThunk = function () {
  return fetchData(function getData(data) {
    console.log(data);
  });
};

asyncThunk();
```

The `getData` function won't be called immediately but it will be invoked only when the data is available from API endpoint. The setTimeout function is also used to make our code asynchronous. The best real time example is redux state management library which uses the asynchronous thunks to delay the actions to dispatch.

## Thunks

Thunk is from a synchronous perspective, a thunk is **a function** that has everything already that it needs to do to give you some value back.

For example for synchronous thunk:

```js
function add(x, y) {
  return x + y;
}

var thunk = function () {
  return add(10, 15);
};

thunk(); // 25
```

With asynchronous thunk, you need to pass a callback to the thunk:

```js
function addAsync(x, y, callback) {
  setTimeout(function () {
    callback(x + y);
  }, 1000);
}

var thunk = function (callback) {
  addAsync(10, 15, callback);
};

thunk(function (sum) {
  console.log(sum);
});
```

By wrapping this function around the state and allowing it to be asynchronous in nature we have essentially normalized time out of the equation we have factored time out of the equation. We have produced a wrapper around the value that has become time independent.

=> Promise is the higher level abstraction of a thunk.

=> Thunk will not called until you call it for the first time, the next time you call it, it just returns values.

## Examples

````javascript
/**
# Instructions

1. You'll do the same thing as the previous exercise(s), but now you should use thunks.

2. Expected behavior:
    - Request all 3 files at the same time (in "parallel").
    - Render them ASAP (don't just blindly wait for all to finish loading)
    - BUT, render them in proper (obvious) order: "file1", "file2", "file3".
    - After all 3 are done, output "Complete!".
 */

function fakeAjax(url, cb) {
  var fake_responses = {
    file1: "The first text",
    file2: "The middle text",
    file3: "The last text",
  };
  var randomDelay = (Math.round(Math.random() * 1e4) % 8000) + 1000;

  console.log("Requesting: " + url);

  setTimeout(function () {
    cb(fake_responses[url]);
  }, randomDelay);
}

function output(text) {
  console.log(text);
}

// **************************************

function getFile(file) {
  // what do we do here?
  // solution
  var text, fn;
  fakeAjax(file, function (response) {
    // to make an active thunk (async thunk), we have to call `fakeAjax` function to make sure it not lazy thunk.
    if (fn) {
      fn(response);
    } else {
      text = response;
    }
  });

  // and thunk needs a callback function, so we expect it like this.
  return function (cb) {
    if (text) {
      cb(text);
    } else {
      fn = cb;
    }
  };
}

/**
 * Explaination for `getFile` function:
 * Obviously, we know that block of code from line 39 to 43 will be executed first before the block of code from line 49 to 53, or vice versace.
 * Those are the only 2 possible outcomes.
 *
 * So, let's take the **first case**, the block of code from line 39 to 43 will be executed first.
 * Then, we need to save the response into the `text` variable.
 * Then, we pass the `text` into the callback function.
 * Code could be like this:
 * ```
 * var text;
 * fakeAjax(file, function (response) {
 *   text = response;
 * });
 *
 * return function (cb) {
 *  cb(text)
 * }
 * ```
 *
 * Now, let's take the **second case**, the block of code from line 49 to 53 will be executed first.
 * But we don't have the response yet, so we have to save the callback function into the `fn` variable.
 * And when line 39 to 43 is executed, we have to call the callback function.
 * We can pass the response into the callback function, which in this case is `fn` variable.
 * Code could be like this:
 * ```
 * var fn;
 * fakeAjax(file, function (response) {
 *  fn(response);
 * });
 *
 * return function (cb) {
 *  fn = cb;
 * }
 * ```
 *
 * So when combining those 2 cases, we will get the `getFile` function.
 */

// request all files at once in "parallel"
var th1 = getFile("file1");
var th2 = getFile("file2");
var th3 = getFile("file3");

// When implementing thunk, remember it has a callback function
th1(function (text1) {
  output(text1);
  th2(function (text2) {
    output(text2);
    th3(function (text3) {
      output(text3);
      output("Complete!");
    });
  });
});
// -> in the th1, th2, and th3, we always call these functions in the sequence, which helps us avoid the loop in the previous solution.
// The result will be printed the same as we expected.
// The magic point is in `getFile` function
````
